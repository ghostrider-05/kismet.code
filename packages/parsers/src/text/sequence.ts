/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Sequence, SequenceItemType, SequenceItemTypeof, SequenceNode, SequenceVariable } from '@kismet.ts/core'
import { capitalize, constructItem, destructureProperty, indent } from '@kismet.ts/shared'

import { BaseTextParser } from './internals/baseParser.js'
import { TextNodeParser } from './node.js'

import type { TextSequenceParserOptions } from './options.js'

export class TextSequenceParser<
    T extends boolean = true
> extends BaseTextParser<T> {
    /**
     * The character / expression used to split items in a line.
     * Note: if you want to have the options with a '>', change this to '->' or the options would be split
     * @default /->|>/
     */
    public static splitChar: string | RegExp = /->|>/

    /**
     * The character to use for seperating properties in {@link InputTextSequenceParser.parsePropertyChain}
     */
    public propertyChar = '.'

    constructor (
        items: SequenceItemType[],
        protected override options: TextSequenceParserOptions<T>
    ) {
        super(items, options)
        this.manager.variables = options.variables
    }

    public static formatBase (input: string): string {
        const format = (t: string) => t.endsWith(')') ? t : `${t}()`

        if (input[0].toUpperCase() === input[0]) return format(input)
        else return format(capitalize(input)!)
    }

    private applyRawArguments (args: string) {
        if (!args.includes(',')) return [destructureProperty(args)]
        return args.split(',').map(arg => destructureProperty(arg))
    }

    /**
     * Check if the input can be a sequence string.
     * Uses {@link TextSequenceParser.splitChar} to check
     * @param input Unknown input to check
     */
    public isSequenceInput (input: string): boolean {
        const char = TextSequenceParser.splitChar

        return typeof char === 'string'
            ? input.includes(char)
            : char.test(input)
    }

    // TODO change order of adding items to correctly display when using autoposition
    /**
     * Convert a series of get properties to an sequence
     * @param input The input sequence in text
     * @returns
     * @example
     * Player().PRI.Team.TeamPlayer
     * Player().PRI.Team.<Integer>TeamIndex
     * Player(bAllPlayers=False).PRI.Team
     */
    public parsePropertyChain (input: string) {
        const sequence = this.createSequence()

        const [baseVariable, ...chain] = input.split(this.propertyChar)
        const [variableName, variableArguments] = baseVariable.split('(')

        if (chain.length === 0) return undefined

        const beginItem = this.manager.findVariable(variableName)
        beginItem.raw = this.applyRawArguments(variableArguments.slice(0, -1))

        const sequenceItems = chain.flatMap(line => {
            const match = line.match(/(?!>)(\w+)/g)
            const propertyType =
                (match?.length ?? 0) > 1 ? match?.[0] : 'Object'
            const propertyName = match?.[1] ?? line
            const variable = this.manager.findVariable(propertyType)

            const action = constructItem<SequenceItemType, SequenceItemTypeof>(this.manager.variables['GetProperty']).setProperty({
                name: 'PropertyName',
                value: propertyName
            })

            return [variable, action]
        })

        sequence.addItems([...sequenceItems, beginItem])

        sequence.items.forEach((item, index) => {
            if (!item.isAction()) return // Type check
            const target =
                    index === 1
                        ? beginItem
                        : <SequenceVariable>sequenceItems.at(index - 3),
                output = <SequenceVariable>sequenceItems.at(index - 1)

            const newItem = (
                index + 2 >= sequenceItems.length
                    ? item
                    : item.addOutputConnection(
                          { name: 'Out' },
                          {
                              name: 'In',
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              item: <SequenceNode>sequenceItems.at(index + 2)!,
                          }
                      )
            )
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                .setVariable(this.manager.findVariableType(output)!, output)
                .setVariable('Target', target)

            sequence.update(newItem)
        })

        return this.convert(sequence)
    }

    // TODO: allow variable items in properties
    public parseSequence (input: string): Sequence {
        const sequence = this.createSequence()
        const idItems: Record<string, SequenceItemType> = {}

        const { newLinesSeperation, extractItem, extractSequenceOrder } =
            this.options

        const blocks = input.split('\n'.repeat(newLinesSeperation))

        blocks.forEach(block => {
            extractSequenceOrder(block).forEach(items => {
                const newItems = items.map(rawItem => {
                    const { name, id, inputName, outputName, variables } =
                        extractItem(rawItem.trim())
                    const item =
                        id && idItems[id]
                            ? idItems[id]
                            : this.manager.findName(name)

                    if (!item)
                        throw new Error(`No item found with the name ${name}`)

                    if (variables) {
                        item.raw.push(
                            ...this.applyRawArguments(variables).filter(
                                ([name, value]) => {
                                    const isReference =
                                        Object.keys(idItems).includes(value)

                                    if (isReference) {
                                        item.isSequenceNode()
                                            ? item.setVariable(
                                                  name,
                                                  <SequenceVariable>(
                                                      idItems[value]
                                                  )
                                              )
                                            : undefined
                                    }

                                    return !isReference
                                }
                            )
                        )
                    }

                    if (id) idItems[id] = item

                    return {
                        item,
                        names: [outputName, inputName],
                    }
                })

                sequence.addItems(
                    newItems.map(({ item, names }, index) => {
                        const [outputName, inputName] = names
                        const output = newItems[index + 1]
                            ? {
                                  name: inputName!,
                                  item: <SequenceNode>newItems[index + 1].item,
                              }
                            : undefined

                        return output
                            ? item.isSequenceActionNode()
                                ? item.addOutputConnection(
                                      { name: outputName! },
                                      output
                                  )
                                : item.isEvent()
                                ? item.on(outputName!, output)
                                : item
                            : item
                    })
                )
            })
        })

        return sequence
    }

    protected parseRawSubsequence (parent: Sequence, item: string, depth: number) {
        const stripIndents = ( text: string, amount?: number) => {
            return text.split('\n').map(line => line.slice(indent(amount).length)).join('\n')
        } 
        const children = item.split(new RegExp(`/\n${indent(depth)}(?=Begin Object)/g`))
            .filter(n => TextNodeParser.isNodeInput(stripIndents(n, depth)))
            .map(n => stripIndents(n, depth))


        const { subSequence } = parent.addSubSequence({
            name: this.parseRawItem(item).name
        })

        this.parseRawSequenceItems(subSequence, children, true, depth)
    }

    protected parseRawSequenceItems (sequence: Sequence, items: string[], subSequences = true, depth: number) {
        for (const item of items) {
            const constructedItem = this.parseRawItem(item)

            if (constructedItem.ClassData.Class === 'Sequence') {
                if (subSequences === false) {
                    continue
                }

                this.parseRawSubsequence(sequence, item, depth + 1)
            } else {
                sequence.addItem(constructedItem)
            }
        }
    }

    public parseRawSequence (input: string, options?: { parseSubSequences?: boolean }) {
        const sequence = this.createSequence()
        const items = input.split(/\n(?=Begin Object)/g)
            .filter(n => n.length > 0)

        this.parseRawSequenceItems(sequence, items, options?.parseSubSequences, 0)

        return this.convert(sequence)
    }

    public parseRawSingleSequence (input: string) {
        return this.parseRawSequence(input, { parseSubSequences: false })
    }
}
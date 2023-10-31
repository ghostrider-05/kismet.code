import { SequenceItemType, SequenceItemTypeof, SequenceNode, SequenceVariable } from '@kismet.ts/core'
import { constructItem, destructureProperty } from '@kismet.ts/shared'

import { BaseTextParser } from "./internals/baseParser.js"
import type { TextPropertySequenceParserOptions } from './options.js'

export class TextPropertySequenceParser<T extends boolean = true> extends BaseTextParser<T> {
    /**
     * The character to use for seperating properties
     */
    public char = '.'

    public constructor (
        items: SequenceItemType[],
        protected override options: TextPropertySequenceParserOptions<T>,
    ) {
        super(items, options, options.variables)
        if (options.char) this.char = options.char
    }

    private getRawArguments (args: string) {
        if (!args.includes(',')) return [destructureProperty(args)]
        return args.split(',').map(arg => destructureProperty(arg))
    }

    private getStartingVariable (start: string) {
        if (!start.includes('(')) {
            return this.manager.findVariable(start)
        } else {
            const [variableName, variableArguments] = start.split('(')

            const beginItem = this.manager.findVariable(variableName)
            beginItem.raw = this.getRawArguments(variableArguments.slice(0, -1))
    
            return beginItem
        }
    }

    private getItemData (input: string): Record<'name' | 'type', string> {
        const match = input.match(/(?!>)(\w+)/g)

        const type =(match?.length ?? 0) > 1 
            ? match?.[0] ?? 'Object'
            : 'Object'
        const name = match?.[1] ?? input

        return {
            name,
            type,
        }
    }

    private convertChainToItems (inputs: string[], spacing?: { nodes: number, variable: number }) {
        let position = 0

        const items = inputs.flatMap(line => {
            const { name, type } = this.getItemData(line)

            const variable = this.manager.findVariable(type)
                .setPosition({ x: position, y: spacing?.variable ?? 0 })

            const action = constructItem<SequenceItemType, SequenceItemTypeof>(this.options.getPropertyAction)
                .setProperty({ name: 'PropertyName', value: name })
                .setComment({ supressAutoComment: false })
                .setPosition({ x: position, y: 0 })

            if (spacing?.nodes) position += spacing.nodes

            return [variable, action]
        })

        return items
    }

    /**
     * Convert a series of get properties to an sequence
     * @param input The input sequence in text
     * @returns
     * @example
     * Player().PRI.Team.TeamPlayer
     * Player().PRI.Team.<Integer>TeamIndex
     * Player(bAllPlayers=False).PRI.Team
     */
    public parse (input: string, spacing?: { nodes: number, variable: number }) {
        // if (!input.includes(this.char)) return undefined
        const sequence = this.createSequence()

        const [baseVariable, ...chain] = input.split(this.char)
        if (chain.length === 0) throw new Error('No properties found on ' + baseVariable)

        const beginItem = this.getStartingVariable(baseVariable)
            .setPosition({ 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                x: -((spacing?.nodes ?? 0) > 0 ? spacing!.nodes / 2 : 0), 
                y: spacing?.variable ?? 0 
            })

        const sequenceItems = this.convertChainToItems(chain, spacing)
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
}
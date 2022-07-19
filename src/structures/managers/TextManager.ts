import { KismetFile } from '../project.js'
import {
    BaseItem,
    BaseSequenceItem,
    Sequence,
    SequenceNode,
    SequenceVariable,
} from '../Sequence/index.js'

import { Constants, destructureProperty } from '../../shared/index.js'

import type {
    SequenceItemType,
    If,
    SequenceOptions,
    SchemaItemNames,
} from '../../types/index.js'

const {
    Actions: { GetProperty },
    Variables,
} = KismetFile.Items

class InputTextManager {
    public items: SequenceItemType[]

    constructor (items: SequenceItemType[]) {
        this.items = items
    }

    private convertVarName (name: string, type: boolean) {
        if (name !== 'Int' && name !== 'Integer') return name

        return type ? 'Integer' : 'Int'
    }

    public findName (name: string): SequenceItemType | undefined {
        const filter = (_a: string, _b: string) => {
            const a = _a.toLowerCase(),
                b = _b.toLowerCase()

            return a === b || a.split('_')[1] === b
        }

        const item = this.items.find(item => {
            return (
                filter(item.name, name) ||
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                filter(new item()['kismet'].class, name)
            )
        })

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return item ? new item() : undefined
    }

    public findVariable (name: string | undefined): SequenceVariable {
        if (!name) throw new Error('Unknown property variable')

        const variable =
            Variables[<keyof typeof Variables>this.convertVarName(name, true)]

        if (!variable) throw new Error('Unknown property variable: ' + name)

        return new variable()
    }

    public findVariableType (variable: SequenceVariable): string | undefined {
        const name = Object.keys(Variables).find(_key => {
            const key = _key as keyof typeof Variables

            return variable instanceof Variables[key]
        })

        return name ? this.convertVarName(name, false) : undefined
    }
}

class BaseTextParser<
    T extends boolean = true,
    O extends TextParserOptions<T> | undefined =
        | TextParserOptions<T>
        | undefined
> {
    protected manager: InputTextManager
    protected options: O

    constructor (items: SequenceItemType[], options?: O) {
        this.manager = new InputTextManager(items)

        this.options = options!
    }

    protected convert<R extends BaseItem> (item: R | undefined) {
        return (this.options?.convertToString ? item?.toString() : item) as
            | If<T, string, R>
            | undefined
    }

    protected createSequence () {
        return new Sequence({
            mainSequence: true,
            ...this.options?.sequence,
        })
    }
}

export interface TextParserOptions<T> {
    convertToString?: T
    sequence?: Omit<SequenceOptions<SequenceItemType, SchemaItemNames>, 'name'>
}

export interface TextSequenceParsedItem {
    name: string
    id?: string
    inputName?: string
    outputName?: string
    variables?: string
}

export interface TextSequenceParserOptions<T> extends TextParserOptions<T> {
    newLinesSeperation: number
    extractItem: (item: string) => TextSequenceParsedItem
    extractSequenceOrder: (block: string) => string[][]
}

export class InputTextNodeParser<
    T extends boolean = true
> extends BaseTextParser<T> {
    constructor (items: SequenceItemType[], options?: TextParserOptions<T>) {
        super(items, options)
    }

    public isNodeInput (input: string): boolean {
        const prefix = Constants.KISMET_NODE_LINES.begin('', '').split('=')[0]

        return input.startsWith(prefix)
    }

    public parseNodeName (name: string) {
        return this.convert(this.manager.findName(name))
    }

    public parseNode (input: string) {
        const variables = input
            .split('\n')
            .filter(n => n.startsWith(Constants.KISMET_LINE_INDENT))
            .map(line => destructureProperty(line))
            .reduce((prev, [name, value]) => ({ ...prev, [name]: value }), {})

        return this.convert(BaseSequenceItem.fromJSON(variables))
    }
}

export class InputTextSequenceParser<
    T extends boolean = true
> extends BaseTextParser<T, TextSequenceParserOptions<T>> {
    /**
     * @default /->|>/
     */
    public static splitChar: string | RegExp = /->|>/

    /**
     * The character to use for seperating properties in {@link InputTextSequenceParser.parsePropertyChain}
     */
    public propertyChar = '.'

    constructor (
        items: SequenceItemType[],
        options: TextSequenceParserOptions<T>
    ) {
        super(items, options)
    }

    private applyRawArguments (args: string) {
        return args.split(',').map(arg => destructureProperty(arg))
    }

    /**
     * Check if the input can be a sequence string.
     * Uses {@link InputTextSequenceParser.splitChar} to check
     * @param input Unknown input to check
     */
    public isSequenceInput (input: string): boolean {
        const char = InputTextSequenceParser.splitChar

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

            const action = new GetProperty().setProperty(
                'PropertyName',
                propertyName
            )

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
                        id && idItems[`${name}_${id}`]
                            ? idItems[`${name}_${id}`]
                            : this.manager.findName(name)

                    if (!item)
                        throw new Error(`No item found with the name ${name}`)

                    if (variables)
                        item.raw.push(...this.applyRawArguments(variables))

                    return {
                        item,
                        names: [outputName, inputName],
                    }
                })

                sequence.addItems(
                    newItems.map(({ item, names }, index) => {
                        const [outputName, inputName] = names
                        console.log(names)
                        const output = newItems[index + 1]
                            ? {
                                  name: inputName!,
                                  item: <SequenceNode>newItems[index + 1].item,
                              }
                            : undefined

                        return output
                            ? item.isSequenceNode()
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
}

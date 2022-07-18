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

            return a === b || b.includes(a) || a.includes(b)
        }

        return this.items.find(item => {
            return filter(item.name, name) || filter(item['kismet'].class, name)
        })
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

class BaseTextParser<T extends boolean = true> {
    protected manager: InputTextManager
    protected options?: TextParserOptions<T>

    constructor (items: SequenceItemType[], options?: TextParserOptions<T>) {
        this.manager = new InputTextManager(items)

        this.options = options
    }

    protected convert<R extends BaseItem> (item: R | undefined) {
        return (this.options?.toString ? item?.toString() : item) as
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
    toString?: T
    sequence?: Omit<SequenceOptions<SequenceItemType, SchemaItemNames>, 'name'>
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
        return this.manager.findName(name)?.toString()
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
> extends BaseTextParser<T> {
    public splitChar = ['->', '>']
    /**
     * The character to use for seperating properties in {@link InputTextSequenceParser.parsePropertyChain}
     */
    public propertyChar = '.'
    public connectionChar = ':'

    constructor (items: SequenceItemType[], options?: TextParserOptions<T>) {
        super(items, options)
    }

    /**
     * Check if the input can be a sequence string
     * @param input Unknown input to check
     */
    public isSequenceInput (input: string): boolean {
        return this.splitChar.some(n => input.includes(n))
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
        beginItem.raw = variableArguments
            .slice(0, -1)
            .split(',')
            .map(arg => destructureProperty(arg))

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
}

import { Variables } from "../items/index.js";

import { 
    BaseSequenceItem, 
    Sequence, 
    SequenceAction, 
    SequenceVariable 
} from "../structures/index.js";

import { 
    Constants, 
    t 
} from "../shared/index.js";

import type { 
    Class,
    SequenceItemType,
    TextManagerCharOptions,
    TextManagerInput
} from "../types/index.js";

import { actions } from "../test/index.js";

const { GetProperty } = actions
const { Player } = Variables

class ItemType {
    public linkId = ''
}

export class TextManager<T extends TextManagerInput> {
    public items: BaseSequenceItem[];

    public splitChar = ['->', '>']
    public propertyChar = '.'
    public connectionChar = ':'

    private itemNames: [string, string][];

    constructor (items: T, characters?: TextManagerCharOptions) {
        this.items = Object.keys(items)
            .map(n => Object.keys(items[n])
                .map(k => items[n][k])
            ).flat() as BaseSequenceItem[]

        this.itemNames = this.items.map(n => {
            try {
                const Class = t<typeof ItemType>(n)

                return [new Class().linkId.split('\'')[0], t<Function>(n).name]
            } catch (err) {
                //
            }
        }).filter(n => n) as [string, string][]

        if (characters) Object.keys(characters).map(key => {
            if (t<Record<string, unknown>>(this)[`${key}Char`]) {
                t<Record<string, unknown>>(this)[`${key}Char`] = t<Record<string, unknown>>(characters)[key] as string
            }
        })
    }

    private findNodeName (input: string): string | undefined {
        return this.itemNames.find(n => n.some(k => k.toLowerCase() === input.toLowerCase().trim()))?.[1]
    }

    private isNodeText (input: string): boolean {
        return input.startsWith(Constants.KISMET_NODE_LINES.begin('', ''))
    }

    private propertiesFromNodeInput (input: string) {
        const parseProperty = (input: string) => input.includes('=') ? {
            name: input.split('=')[0],
            value: input.split('=')[1]
        } : null

        if (input.includes('(')) {
            const properties = input.slice(input.indexOf('(') + 1, input.indexOf(')'))

            if (properties.includes(',')) {
                return properties.split(',').filter(n => n).map(n => parseProperty(n)).filter(n => n != null) as { name: string, value: string }[]
            } else {
                return [parseProperty(input)]
            }
        } else return null
    }

    /**
     * Check if the input can be a sequence string
     * @param input Unknown input to check
     */
    public isSequenceText (input: string): boolean {
        return this.splitChar.some(n => input.includes(n))
    }

    /**
     * Check if the given input is certainly not a kismet input
     * @param input 
     * @returns 
     */
    public isInvalidInput (input: string): boolean {
        return !this.isNodeText(input) && !this.isSequenceText(input)
    }

    /**
     * Create a kismet node from text input
     * @param input The text to create the node from
     */
    public node (input: string): SequenceItemType | SequenceItemType[] | undefined {
        if (this.isNodeText(input)) {
            console.log('Input is normal node')
            const nodes = input.replace('End Object', 'End Object#EOF').split('End Object#EOF').map(n => n + 'End Object')

            return nodes.map(node => BaseSequenceItem.fromText(node).item as SequenceItemType)
        } else if (this.findNodeName(input)) {

            return this.createNode(this.findNodeName(input) as string)
        } else if (input.includes(this.propertyChar)) {

            const [obj, ...properties] = input.toLowerCase().split(this.propertyChar)

            if (!obj.includes('player(')) {
                throw new Error('Property chains for objects other than the player class are not supported')
            }

            const playerOptions = this.propertiesFromNodeInput(obj)
            
            const allPlayers = Boolean(playerOptions?.find(n => n?.name === 'allplayers')?.value)
            const index = Number(playerOptions?.find(n => n?.name === 'playeridx')?.value ?? 0)

            const player = new Player()
                .setAllPlayer(allPlayers)
                .setPlayerIndex(index)

            const output = []
            let lastProperty: SequenceAction | null = null, lastVar: SequenceVariable | null = null

            properties.forEach((n, i) => {
                const node = new GetProperty();

                const propertyName = n.includes('(') ? n.slice(0, n.indexOf('(')) : n
                const type = n.includes('(') ? n.slice(n.indexOf('('), -1) : 'Object'

                const variable = Object.keys(Variables).find(n => n === type)

                const Var = variable ? new ((Variables as Record<string, unknown>)[variable] as Class<SequenceVariable>)() : new Variables.Object()

                if (i === 0) {
                    node.setVariable('Target', player)
                        .setVariable('PropertyName', propertyName)
                        .setVariable(type, Var.linkId)
                } else {
                    node.setVariable('Target', player)
                        .setVariable('PropertyName', propertyName)
                        .setVariable(type, (lastVar as SequenceVariable).linkId)

                    lastProperty?.addConnection(node, 'Out', 'In')
                }

                lastProperty = node
                lastVar = Var

                output.push(node, Var)
            })

            output.push(player)

            return output
        } else return undefined
    }

    private createNode (inputName: string) {
        const className = this.findNodeName(inputName)
        if (!className) throw new Error('No class found with name: ' + inputName)

        const Class = this.items.find(n => t<Function>(n).name === className)

        const itemClass = t<typeof ItemType>(Class)
        const item = new itemClass() as SequenceItemType

        return item
    }
 
    /**
     * Create a Sequence from input text
     * @param input The input text
     */
    public sequence (input: string): Sequence {
        const items: SequenceItemType[] = []
        const bracketRegex = /(?<=\()(.*?)(?=\))/g

        const rawInput = input.toLowerCase()
        let lastItem: SequenceItemType | null = null, lastConnection: string | null = null

        if (this.isSequenceText(input)) {
            const splitChar = this.splitChar.find(n => input.includes(n)) as string
            const subsequence = rawInput.split(' ')[0].match(/(?<=sequence\()(.*?)(?=\))/)?.[0]

            const sequence = new Sequence(subsequence)

            for (const node of input.split(splitChar)) {
                const nodeInput = node.replace('()', '')
                
                const connectionName = nodeInput.includes(':') ? nodeInput.split(':').at(-1)?.match(bracketRegex)?.[0] ?? null : null
                const properties = nodeInput.match(bracketRegex)?.map(n => {
                    return n[0].includes(',') ? n[0].split(',').map(k => k.split('=')) : [n[0].split('=')]
                })[0]

                const nodeClass = this.createNode(node);

                items.push(nodeClass)

                lastItem = nodeClass
                lastConnection = connectionName
            }

            return sequence.addItems(items)
        } else throw new Error ('Unable to process sequence: input contains no follow up')
    }
}

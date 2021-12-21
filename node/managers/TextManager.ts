import { Variables } from "../items/index.js";

import { BaseSequenceItem, SequenceAction, SequenceVariable } from "../structures/index.js";

import { 
    Constants, 
    t 
} from "../shared/index.js";

import type { 
    Class,
    SequenceItemType,
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

    public splitChars = ['->', '>']
    public propertyChar = '.'
    public connectionChar = ':'

    private itemNames: [string, string][];

    constructor (items: T) {
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
    }

    private findNodeName (input: string): string | undefined {
        return this.itemNames.find(n => n.some(k => k.toLowerCase() === input.toLowerCase().trim()))?.[1]
    }

    private isNodeText (input: string): boolean {
        return input.startsWith(Constants.KISMET_NODE_LINES.begin('', ''))
    }

    private isSequenceText (input: string): boolean {
        return this.splitChars.some(n => input.includes(n))
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

    public async nodeFromText (input: string): Promise<SequenceItemType | SequenceItemType[] | undefined> {
        if (this.isNodeText(input)) {
            console.log('Input is normal node')
            const nodes = input.split('End Object').map(n => n.split('\n'))

            for (const node of nodes) {
                console.log(node)
            }
        } else if (this.findNodeName(input)) {

            return await this.createNode(this.findNodeName(input) as string)
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
 
    public sequenceFromText (input: string): void {
        const output = []

        if (this.isSequenceText(input)) {
            const splitChar = this.splitChars.find(n => input.includes(n)) as string

            for (const node of input.split(splitChar)) {
                if (!node.includes(this.propertyChar)) {

                    const item = this.createNode(node)

                    if (item) {
                        console.log(item)
                    }
                        
                } else {
                    const [nodeName, ...props] = node.split(this.propertyChar)
                    const item = this.createNode(nodeName)

                    if (item) {
                        console.log(item)
                    }
                }
            }
        } else throw new Error ('Unable to process sequence: input contains no follow up')
    }
}

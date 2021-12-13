import { Constants, t } from "../shared/index.js";
import { SequenceItemType } from "../types/index.js";

interface ItemInput extends Record<string, Record<string, unknown>> {
    actions: Record<string, SequenceItemType>,
    events: Record<string, SequenceItemType>,
    conditions: Record<string, SequenceItemType>
}

export class TextManager {
    public items: ItemInput;

    public splitChars: string[];
    public propertyChar: string;

    private itemNames: [string, string][];

    constructor (items: ItemInput) {
        this.items = items

        class A {
            public linkId = ""
        }

        this.itemNames = Object.keys(items).map(n => Object.keys(items[n]).map(k => {
            try{
                return [new (items[n][k] as typeof A)().linkId.split('\'')[0], k]
            } catch (err) {
                //
            }
        })).flat().filter(n => n != undefined) as [string, string][]

        this.splitChars = ['->', '>']
        this.propertyChar = '.'
    }

    public findNodeName (input: string): string | undefined {
        return this.itemNames.find(n => n.some(k => k.toLowerCase() === input.toLowerCase().trim()))?.[1]
    }

    public isNodeText (input: string): boolean {
        return input.startsWith(Constants.KISMET_NODE_LINES.begin('', ''))
    }

    public isSequenceText (input: string): boolean {
        return this.splitChars.some(n => input.includes(n))
    }

    public nodeFromText (input: string): null | undefined {
        if (this.isNodeText(input)) {
            console.log('Input is normal node')
            const nodes = input.split('End Object').map(n => n.split('\n'))

            for (const node of nodes) {
                console.log(node)
            }
        } else return null
    }
 
    public SequenceFromText (input: string): void {
        if (this.isSequenceText(input)) {
            const splitChar = this.splitChars.find(n => input.includes(n)) as string

            for (const node of input.split(splitChar)) {
                if (!node.includes(this.propertyChar)) {
                    const ClassName = this.findNodeName(node)

                    if (ClassName) {
                        console.log(ClassName)
                    } else {
                        throw new Error('Unable to process sequence: no class found for ' + node)
                    }
                } else {
                    const [nodeName, ...props] = node.split(this.propertyChar)
                    const ClassName = this.findNodeName(nodeName)

                    if (ClassName) {
                        console.log(ClassName, props)
                    } else {
                        throw new Error('Unable to process sequence: no class found for ' + nodeName)
                    }
                }
            }
        } else throw new Error ('Unable to process sequence: input contains no follow up')
    }
}
import { BaseSequenceItem, KismetConnectionType, SequenceItemType } from '@kismet.ts/core'
import { getNodeType, KismetItemFormatter } from '@kismet.ts/shared'

import { BaseTextParser } from './internals/baseParser.js'

import type { TextParserOptions } from './options.js'

export type RawConnectionLinks = Record<KismetConnectionType, string[]>

export interface ParseClassFileOptions { 
    version: number, 
    archetype: string, 
    links: RawConnectionLinks
    extends: string
    optionsTypeName: string

    formatLinks: (links: RawConnectionLinks) => string
}

export class TextNodeParser<
    T extends boolean = true
> extends BaseTextParser<T> {
    constructor (items: SequenceItemType[], options?: TextParserOptions<T>) {
        super(items, options)
    }

    public static parseNodeClassFile  (
        fileName: string,
        archetype: string,
        content: string,
    ) {
        const type = getNodeType(fileName)

        const defaultPropsStart = content.indexOf('defaultproperties')
        if (defaultPropsStart < 0) return

        const defaultOptions = content.slice(
            defaultPropsStart, 
            content.indexOf('\n}', defaultPropsStart))
            .split(/\n|\r\n/)
            .map(line => line.split('=', 1) as [string, string])

        return { 
            type, 
            defaultProperties: defaultOptions,
            item: BaseSequenceItem.fromRaw(defaultOptions.concat(
                !defaultOptions.some(n => n[0] === 'ObjectArchetype')
                    ? ['ObjectArchetype', archetype] 
                    : [])) 
        }
    }

    /** @deprecated */
    public isNodeInput (input: string): boolean {
        return TextNodeParser.isNodeInput(input)
    }

    public static isNodeInput (input: string): boolean {
        const prefix = KismetItemFormatter.firstLine('', '').split('=')[0]

        return input.startsWith(prefix)
    }

    /**
     * Create an item from a single name.
     * @param name The class name of the item. Name can be `SeqAct_MyAction` or `MyAction`.
     */
    public parseNodeName (name: string) {
        return this.convert(this.manager.findName(name))
    }

    public parseRawNode (input: string) {
        return this.convert(this.parseRawItem(input))
    }

    /** @deprecated */
    public parseNode (input: string) {
        return this.convert(this.parseRawItem(input))
    }
}

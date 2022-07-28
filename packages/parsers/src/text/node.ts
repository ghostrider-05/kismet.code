import { BaseSequenceItem } from '@kismet.ts/core'
import { indent, KismetItemFormatter } from '@kismet.ts/shared'

import { BaseTextParser } from './internals/baseParser.js'

import type { TextParserOptions } from './options.js'

export class InputTextNodeParser<
    T extends boolean = true
> extends BaseTextParser<T> {
    constructor (items: SequenceItemType[], options?: TextParserOptions<T>) {
        super(items, options)
    }

    public isNodeInput (input: string): boolean {
        const prefix = KismetItemFormatter.firstLine('', '').split('=')[0]

        return input.startsWith(prefix)
    }

    public parseNodeName (name: string) {
        return this.convert(this.manager.findName(name))
    }

    public parseNode (input: string) {
        const variables = input
            .split('\n')
            .filter(n => n.startsWith(indent()))
            .map(line => destructureProperty(line))
            .reduce((prev, [name, value]) => ({ ...prev, [name]: value }), {})

        return this.convert(BaseSequenceItem.fromJSON(variables))
    }
}

import { BaseItem, BaseSequenceItem, Sequence, SequenceItemType } from '@kismet.ts/core'
import { destructureProperty, If, indent } from '@kismet.ts/shared'

import { InputTextManager } from './inputManager.js'
import type { TextParserOptions } from '../options.js'

export class BaseTextParser<T extends boolean = true> {
    protected manager: InputTextManager

    constructor (items: SequenceItemType[], protected options?: Partial<TextParserOptions<T>>) {
        this.manager = new InputTextManager(items, {})

        this.options = options ?? {}
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

    protected parseRawItem (input: string) {
        console.log([input])
        const variables = input
            .split('\n')
            .filter(n => n.startsWith(indent()))
            .map(line => destructureProperty(line) as [string, string | undefined])
            .concat([['KismetItemIdx', input.split('\n')[0].match(/(?<=_)\d+/g)?.[0]]])
            
        console.log(variables)
        const json = variables.reduce((prev, [name, value]) => ({ ...prev, [name]: value }), {})

        return BaseSequenceItem.fromJSON(json)
    }
}
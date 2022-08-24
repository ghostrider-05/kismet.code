import { BaseItem, Sequence, SequenceItemType } from '@kismet.ts/core'
import type { If } from '@kismet.ts/shared'

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
}
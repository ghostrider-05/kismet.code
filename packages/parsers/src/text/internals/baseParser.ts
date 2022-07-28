import { InputTextManager } from './inputManager.js'
import { TextParserOptions } from '../options.js'

export class BaseTextParser<
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
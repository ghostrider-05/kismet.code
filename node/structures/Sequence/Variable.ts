import { BaseSequenceItem, KismetItemConfigOptions } from './Item.js'

import type { KismetVariableOptions } from '../../types/index.js'

export class SequenceVariable<T extends {} = {}> extends BaseSequenceItem {
    public name?: string | null;

    constructor (options: KismetVariableOptions<T> & KismetItemConfigOptions) {
        super(options)

        this.name = options?.name ?? null
    }

    setName (name: string): this {
        this.name = name

        return this
    }
}
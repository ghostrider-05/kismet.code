import { BaseSequenceItem } from './Item/base.js'

import type { 
    BaseKismetItemOptions, 
    KismetVariableOptions 
} from '../../types/index.js'

export class SequenceVariable<T extends {} = {}> extends BaseSequenceItem {
    public name?: string | null;

    constructor (options: KismetVariableOptions<T> & BaseKismetItemOptions) {
        super(options)

        this.name = options?.name ?? null
    }

    setName (name: string): this {
        this.name = name

        return this
    }
}
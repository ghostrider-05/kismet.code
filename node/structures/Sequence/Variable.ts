import { BaseSequenceItem } from './Item/base.js'

import { addVariable, quote } from '../../shared/index.js'

import type { 
    BaseKismetItemOptions, 
    KismetVariableOptions 
} from '../../types/index.js'

export class SequenceVariable extends BaseSequenceItem {
    public name?: string | null;

    constructor (options: KismetVariableOptions & BaseKismetItemOptions) {
        super(options)

        this.name = options?.name ?? null
    }

    public setName (name: string): this {
        this.name = name

        return this
    }

    public override toKismet (): string {
        const kismet = super.toKismet()

        return this.name ? addVariable(kismet, [['VarName', quote(this.name)]]) : kismet
    }
}
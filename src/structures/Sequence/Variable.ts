import { BaseSequenceItem } from './Item/base.js'

import { addVariable, quote } from '../../shared/index.js'

import type { 
    BaseKismetItemOptions, 
    KismetVariableOptions 
} from '../../types/index.js'

export class SequenceVariable extends BaseSequenceItem {
    public name?: string | null;

    constructor (options: KismetVariableOptions & BaseKismetItemOptions) {
        super({ ...options, type: 'variables' })

        this.name = options?.name ?? null
    }

    public setName (name: string): this {
        this.name = name

        return this
    }

    public override toString(): string {
        const kismet = super.toString()

        return this.name ? addVariable(kismet, [['VarName', quote(this.name)]]) : kismet
    }

    /**
     * @deprecated 
     */
    public override toKismet (): string {
        return this.toString()
    }
}
import { BaseSequenceItem } from './Item/base.js'

import { addVariable, Constants, quote } from '../../shared/index.js'

import type {
    BaseKismetItemOptions,
    KismetVariableOptions
} from '../../types/index.js'

export class SequenceVariable extends BaseSequenceItem {
    public variableName?: string | null

    constructor (options: KismetVariableOptions & BaseKismetItemOptions) {
        super({ ...options, type: Constants.NodeType.VARIABLES })

        this.variableName = options?.name ?? null
    }

    public setName (name: string): this {
        this.variableName = name

        return this
    }

    public override toString (): string {
        const kismet = super.toString()

        return this.variableName
            ? addVariable(kismet, [['VarName', quote(this.variableName)]])
            : kismet
    }

    /**
     * @deprecated
     */
    public override toKismet (): string {
        return this.toString()
    }
}

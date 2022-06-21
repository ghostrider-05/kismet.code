import { SequenceVariable } from '../../structures/index.js'

import { 
    addVariable
} from '../../shared/index.js'

import type { 
    KismetVariableOptions 
} from '../../types/index.js'

export class ExternalVariable extends SequenceVariable {
    public expectedType: string | null = null
    public variableLabel: string | null = null

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjectArchetype: `SeqVar_External'Engine.Default__SeqVar_External'`,
            inputs: {}
        })
    }

    public setExternalVariable<T extends SequenceVariable> (options?: { label?: string, type?: T }): this {
        this.expectedType = options?.type?.['kismet']['classType'] ?? null
        this.variableLabel = options?.label ?? null

        return this
    }

    public override toString (): string {
        const kismet = super.toString()

        const variables = [
            (this.expectedType ? ['ExpectedType', this.expectedType] : []),
            (this.variableLabel ? ['VariableLabel', `"${this.variableLabel}"`] : [])
        ].filter(n => n.length > 0) as [string, string][]

        return addVariable(kismet, variables)
    }
}

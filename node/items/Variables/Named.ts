import { SequenceVariable } from '../../structures/index.js'

import { 
    addVariable
} from '../../shared/index.js'

import type { 
    KismetVariableOptions 
} from '../../types/index.js'

export class NamedVariable extends SequenceVariable {
    public expectedType: string | null = null
    public searchVariableName: string | null = null

    constructor (options: KismetVariableOptions) {
        super ({
            ...options,
            ObjectArchetype: `SeqVar_Named'Engine.Default__SeqVar_Named'`,
            inputs: {}
        })
    }

    public setSearchVariable<T extends SequenceVariable> (options: { name?: string, type: T}): this {
        this.searchVariableName = options.name ?? null
        this.expectedType = options.type?.['kismet']['classType'] ?? null

        return this
    }

    public override toKismet(): string {
        const kismet = super.toKismet()

        const variables = [
            (this.expectedType ? ['ExpectedType', this.expectedType] : []),
            (this.searchVariableName ? ['FindVarName', `"${this.searchVariableName}"`] : [])
        ].filter(n => n.length > 0) as [string, string][] 

        return addVariable(kismet, variables)
    }
}

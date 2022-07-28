import { SequenceVariable } from "../../structures/Sequence/Variable.js"

import { 
    addVariable
} from "../../shared/index.js"

import type { 
    KismetVariableOptions 
} from "../../types/index.js"

export class BoolVariable extends SequenceVariable {
    public value: boolean;

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjectArchetype: `SeqVar_Bool'Engine.Default__SeqVar_Bool'`,
            inputs: {}
        })

        this.value = false
    }

    public setValue (value: boolean): this {
        this.value = value

        return this
    }

    public override toString (): string {
        return addVariable(super.toString(), [
            ['bValue', this.value ? '1' : '0']
        ])
    }
}
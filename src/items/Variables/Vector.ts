import { SequenceVariable } from "../../structures/Sequence/Variable.js"

import { 
    addVariable 
} from "../../shared/index.js"

import type { 
    KismetVariableOptions,
    KismetVectorComponents
} from "../../types/index.js"

export class VectorVariable extends SequenceVariable {
    public value: KismetVectorComponents;

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjectArchetype: `SeqVar_Vector'Engine.Default__SeqVar_Vector'`,
            inputs: {}
        })

        this.value = {
            x: 0.0,
            y: 0.0,
            z: 0.0
        }
    }

    public setValue (value: KismetVectorComponents): this {
        this.value = value

        return this
    }

    /**
     * @deprecated
     */
    public override toKismet (): string {
        return this.toString()
    }

    public override toString (): string {
        const { x, y, z } = this.value
        const components = `(X=${x},Y=${y},Z=${z})`

        return addVariable(super.toString(), [['VectValue', components]])
    }
}
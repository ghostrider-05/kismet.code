import { SequenceVariable } from "../../structures/Sequence/Variable.js"

import { 
    addVariable,
    quote
} from "../../shared/index.js"

import type { 
    KismetVariableOptions 
} from "../../types/index.js"

export class StringVariable extends SequenceVariable {
    public value = ''

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjectArchetype: `SeqVar_String'Engine.Default__SeqVar_String'`,
            inputs: {}
        })
    }

    public setValue (value: string): this {
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
        const properties: [string, string][] = this.value !== '' ? [
            ['StrValue', quote(this.value)]
        ] : []

        return addVariable(super.toString(), properties)
    }
}
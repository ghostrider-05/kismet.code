import { SequenceVariable, KismetVariableOptions } from "@kismet.ts/core"

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
        return this.setProperty({ 
            name: 'bValue', 
            value: this.value ? '1' : '0' 
        })
        .toString()
    }
}
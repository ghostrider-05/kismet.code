import { SequenceVariable, KismetVariableOptions } from "@kismet.ts/core"
import { quote } from "@kismet.ts/shared"

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

    public override toString (): string {
        const properties: [string, string][] = this.value !== '' ? [
            ['StrValue', quote(this.value)]
        ] : []

        this.raw.push(...properties)

        return super.toString()
    }
}
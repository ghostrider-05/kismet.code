import { SequenceVariable, KismetBoolean, KismetVariableOptions } from "@kismet.ts/core"

export class InterpData extends SequenceVariable {
    public bakeAndPrune = false

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjInstanceVersion: 1,
            ObjectArchetype: `InterpData'Engine.Default__InterpData'`,
            inputs: {}
        })
    }

    public setBakeOptions (options: { bakeAndPrune?: boolean }): this {
        this.bakeAndPrune = options.bakeAndPrune ?? false

        return this
    }

    public override toString (): string {
        this.raw.push(['bShouldBakeAndPrune', KismetBoolean.toKismet(this.bakeAndPrune)])
        
        return super.toString()
    }
}

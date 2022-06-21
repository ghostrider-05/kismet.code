import { SequenceVariable } from '../../structures/index.js'

import { 
    addVariable, 
    boolToKismet
} from '../../shared/index.js'

import type { 
    KismetVariableOptions 
} from '../../types/index.js'

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
        const kismet = super.toString()

        return addVariable(kismet, [
            ['bShouldBakeAndPrune', boolToKismet(this.bakeAndPrune)]
        ])
    }
}

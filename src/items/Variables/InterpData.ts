import { SequenceVariable } from '../../structures/index.js'

import { 
    addVariable, 
    boolToKismet
} from '../../shared/index.js'

import type { 
    KismetVariableOptions 
} from '../../types/index.js'

export class InterpData extends SequenceVariable {
    public bakeAndPrune: boolean

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjInstanceVersion: 1,
            ObjectArchetype: `InterpData'Engine.Default__InterpData'`,
            inputs: {}
        })

        this.bakeAndPrune = false
    }

    public setBakeOptions (options: { bakeAndPrune?: boolean }) {
        this.bakeAndPrune = options.bakeAndPrune ?? false
    }

    public override toKismet(): string {
        const kismet = super.toKismet()

        return addVariable(kismet, [
            ['bShouldBakeAndPrune', boolToKismet(this.bakeAndPrune)]
        ])
    }
}

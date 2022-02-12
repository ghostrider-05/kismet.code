import { SequenceVariable } from "../../structures/Sequence/Variable.js"

import { 
    addVariable 
} from "../../shared/index.js"

import type { 
    KismetVariableOptions 
} from "../../types/index.js"

export class IntegerVariable extends SequenceVariable {
    public value: number;

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjectArchetype: `SeqVar_Int'Engine.Default__SeqVar_Int'`,
            inputs: {}
        })

        this.value = 0.0
    }

    public setValue (value: number): this {
        this.value = value

        return this
    }

    public override toKismet (): string {
        return addVariable(super.toKismet(), [['IntValue', this.value.toString()]])
    }
}

export class RandomIntegerVariable extends IntegerVariable {
    public minValue: number;
    public maxValue: number;

    constructor (options?: KismetVariableOptions) {
        super(options)

        this.minValue = 0
        this.maxValue = 100
        
        this.setKismetSetting('ObjectArchetype', `SeqVar_RandomInt'Engine.Default__SeqVar_RandomInt'`)
    }

    public setMinValue (min: number): this {
        this.minValue = min

        return this
    }

    public setMaxValue (max: number): this {
        this.maxValue = max

        return this
    }

    public override toKismet (): string {
        const kismet = super.toKismet()

        return addVariable(kismet, [
            ['Min', this.minValue.toString()],
            ['Max', this.maxValue.toString()]
        ])
    }
}
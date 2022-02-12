import { SequenceVariable } from "../../structures/Sequence/Variable.js";

import { 
    addVariable 
} from "../../shared/index.js";

import type { 
    KismetVariableOptions 
} from "../../types/index.js";

export class FloatVariable extends SequenceVariable {
    public value: number;

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjectArchetype: `SeqVar_Float'Engine.Default__SeqVar_Float'`,
            inputs: {}
        })

        this.value = 0.0
    }

    public setValue (value: number): this {
        // Throw error if value is an integer?
        if (Number.isInteger(value)) throw new Error('Value is an integer, not a float')

        this.value = value

        return this
    }

    public override toKismet (): string {
        return addVariable(super.toKismet(), [['FloatValue', this.value.toString()]])
    }
}

export class RandomFloatVariable extends FloatVariable {
    public minValue: number;
    public maxValue: number;

    constructor (options?: KismetVariableOptions) {
        super(options)

        this.minValue = 0.0
        this.maxValue = 1.0
        
        this.setKismetSetting('ObjectArchetype', `SeqVar_RandomFloat'Engine.Default__SeqVar_RandomFloat'`)
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
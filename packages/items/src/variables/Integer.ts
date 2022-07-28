import { SequenceVariable } from "../../structures/Sequence/Variable.js"

import { 
    addVariable, KismetError 
} from "../../shared/index.js"

import type { 
    KismetVariableOptions 
} from "../../types/index.js"

export class IntegerVariable extends SequenceVariable {
    public value = 0

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjectArchetype: `SeqVar_Int'Engine.Default__SeqVar_Int'`,
            inputs: {}
        })
    }

    protected _ValidateInt (value: number): void {
        if (!Number.isInteger(value)) throw new KismetError('INTEGER_INPUT')
    }

    public setValue (value: number): this {
        this._ValidateInt(value)
        this.value = value

        return this
    }

    public override toString (): string {
        return addVariable(super.toString(), [['IntValue', this.value.toString()]])
    }
}

export class RandomIntegerVariable extends IntegerVariable {
    public minValue = 0
    public maxValue = 100

    constructor (options?: KismetVariableOptions) {
        super(options)
        
        this.setKismetSetting('ObjectArchetype', `SeqVar_RandomInt'Engine.Default__SeqVar_RandomInt'`)
    }

    public setMinValue (min: number): this {
        this._ValidateInt(min)

        this.minValue = min

        return this
    }

    public setMaxValue (max: number): this {
        this._ValidateInt(max)
        if (max < this.minValue) throw new KismetError('RANGE_LOWER_MIN')

        this.maxValue = max

        return this
    }

    public override toString (): string {
        const kismet = super.toString()

        return addVariable(kismet, [
            ['Min', this.minValue.toString()],
            ['Max', this.maxValue.toString()]
        ])
    }
}
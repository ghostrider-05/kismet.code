import { SequenceVariable, KismetVariableOptions } from "@kismet.ts/core"
import { KismetError } from "@kismet.ts/shared";

export class FloatVariable extends SequenceVariable {
    public value = 0.0
    public allowIntegers: boolean;

    constructor (options?: KismetVariableOptions & { allowIntegers?: boolean }) {
        super({
            ...options,
            ObjectArchetype: `SeqVar_Float'Engine.Default__SeqVar_Float'`,
            inputs: {}
        })

        this.allowIntegers = options?.allowIntegers ?? true
    }

    protected _ValidateFloatNumber (value: number): void {
        if (this.allowIntegers) return
        const isInt = /^-?[0-9]+$/.test(String(value));

        if (isInt) throw new KismetError('FLOAT_INPUT')
    }

    public setValue (value: number): this {
        this._ValidateFloatNumber(value)

        this.value = value

        return this
    }

    public override toString (): string {
        this.raw.push(['FloatValue', this.value.toString()])

        return super.toString()
    }
}

export class RandomFloatVariable extends FloatVariable {
    public minValue = 0.0
    public maxValue = 1.0

    constructor (options?: KismetVariableOptions & { allowIntegers?: boolean }) {
        super(options)
        
        this.rawData.ObjectArchetype = `SeqVar_RandomFloat'Engine.Default__SeqVar_RandomFloat'`
    }

    public setMinValue (min: number): this {
        this._ValidateFloatNumber(min)
        this.minValue = min

        return this
    }

    public setMaxValue (max: number): this {
        this._ValidateFloatNumber(max)
        if (max < this.minValue) throw new KismetError('RANGE_LOWER_MIN')
        this.maxValue = max

        return this
    }

    public override toString (): string {
        this.raw.push(...<[string, string][]>[
            ['Min', this.minValue.toString()],
            ['Max', this.maxValue.toString()]
        ])

        return super.toString()
    }
}
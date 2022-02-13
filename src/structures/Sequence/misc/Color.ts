export class KismetColor {
    public MIN_COLOR_VALUE: number
    public MAX_COLOR_VALUE: number
    public R: number
    public G: number
    public B: number
    public A: number

    constructor (options?: { R: number, G: number, B: number, A: number}) {
        this.MIN_COLOR_VALUE = 0
        this.MAX_COLOR_VALUE = 255

        if (options) this._validateOptions(options)

        this.R = options?.R ?? 0
        this.G = options?.G ?? 0
        this.B = options?.B ?? 0
        this.A = options?.A ?? 255
    }

    private _validateNumber (value: number): void {
        if (typeof value !== 'number') throw new Error('Expected number as color. Received value of type' + typeof value)

        const isInvalid = value < this.MIN_COLOR_VALUE || value > this.MAX_COLOR_VALUE

        if (isInvalid) throw new Error(`Invalid color value. Expected value between ${this.MIN_COLOR_VALUE} and ${this.MAX_COLOR_VALUE}. Received: ${value}`)
    }

    private _validateOptions (options: Record<string, number>): void {
        Object.keys(options).forEach(key => {
            const value = options[key]
            
            this._validateNumber(value)
        })
    }

    public setColor(type: 'R' | 'G' | 'B' | 'A', value: number): this {
        this._validateNumber(value)

        if (type in this && !type.includes('_')) {
            this[type] = value
        }

        return this
    }

    public setColors (colors: [number, number, number, number]): this {
        colors.forEach(color => this._validateNumber(color))

        this.R = colors[0]
        this.G = colors[1]
        this.B = colors[2]
        this.A = colors[3]

        return this
    }

    public toString (): string {
        return `(B=${this.B},G=${this.G},R=${this.R},A=${this.A})`
    }
}

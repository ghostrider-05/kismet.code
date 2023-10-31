import {
    type RawUnrealClassCompareResult, 
} from "./comparer.js";

export class UnrealClassesComparedFormatter {
    constructor (private readonly result: RawUnrealClassCompareResult) {

    }

    private get keys () {
        return ['defaultproperties', 'variables', 'flags'] as const
    }

    private keyLength (key: typeof this.keys[number]) {
        return this.result[key].a.length + this.result[key].b.length + this.result[key].diff.length
    }

    public get differences (): number {
        return this.keys.reduce((count, key) => count + this.keyLength(key), 0)
    }

    private get isEmpty () {
        return this.differences === 0
    }

    public toJSON (): {} | RawUnrealClassCompareResult {
        return this.isEmpty ? {} : this.result
    }

    /**
     * ```diff
     * + a
     * - b
     * +/- diff
     * ```
     */
    public diff (header: number, key: typeof this.keys[number]) {
        if (this.keyLength(key) === 0) return ''

        const a = this.result[key].a.map(line => `+ (${line[1]}): ${line[0]}`).join('\n')
        const b = this.result[key].b.map(line => `- (${line[1]}): ${line[0]}`).join('\n')
        const diff = this.result[key].diff.map(([x, y]) => `+ (${x[1]}): ${x[0]}\n- (${y[1]}): ${y[0]}`).join('\n')
        return `${'#'.repeat(header)} ${key}\n\n\`\`\`diff\n${a}${a.length > 0 ? '\n' : ''}${b}${b.length > 0 ? '\n' : ''}${diff}${diff.length > 0 ? '\n' : ''}\`\`\``
    }

    public toString (header: number, subHeader: number): string {
        if (this.isEmpty) return ''

        const diff = this.keys.map(key => this.diff(subHeader, key)).filter(n => n.length > 0).join('\n')

        return `${'#'.repeat(header)} ${this.result._data.Class[0]}\n\n${diff}\n`
    }
}

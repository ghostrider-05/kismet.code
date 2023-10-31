export type RawUnrealLine = [content: string, line: number]

export interface RawUnrealClass {
    ObjectArchetype: string
    defaultproperties: RawUnrealLine[]
    flags: RawUnrealLine[]
    variables: RawUnrealLine[]
    Class: string
    Extends: string
}

// TODO: move to /shared
type ExtendingProperties<T, V> = keyof T extends infer K ? K extends keyof T ? T[K] extends V ? K : never : never : never

export interface RawUnrealClassCompareResultLines {
    a: RawUnrealLine[];
    b: RawUnrealLine[];
    diff: [RawUnrealLine, RawUnrealLine][]
}

export type RawUnrealClassCompareResult = {
    _data: Record<ExtendingProperties<RawUnrealClass, string>, [string, string]>
} & Record<ExtendingProperties<RawUnrealClass, RawUnrealLine[]>, RawUnrealClassCompareResultLines>

// Comparer types

type Converter = Record<
    ExtendingProperties<RawUnrealClass, RawUnrealLine[]>,
    Exclude<keyof typeof UnrealClassesComparer, 'prototype' | 'convert' | 'compare'>
>
type ConvertResult = Record<ExtendingProperties<RawUnrealClass, RawUnrealLine[]>, RawUnrealClassCompareResultLines>

/**
 * Compare results: \
 * 1: ++ in a, but not in b \
 * 0: +- in both, but different \
 * -1: -- not in a, but in b
 */
export class UnrealClassesComparer {
    public constructor (
        private a: RawUnrealClass, 
        private b: RawUnrealClass
    ) {}

    private static _compare (a: RawUnrealLine, b: RawUnrealLine[], equals: (a: string, b: string) => number) {
        const num = Math.max(...b.map(line => equals(a[0], line[0])))
        const line = b.find(i => equals(a[0], i[0]) === num)
        // if (!line) throw new Error('Unable to find match for ' + a[0] + " with result " + num)

        return [num, line ?? ['', 2]]
    }

    private static compareAll (a: RawUnrealLine[], b: RawUnrealLine[], equals: (a: string, b: string) => number) {
        return a.map(c => [...c, ...this._compare(c, b, equals)] as [...RawUnrealLine, number, RawUnrealLine])
    }

    protected convert<T extends keyof RawUnrealClass> (name: T, results: [...RawUnrealLine, number, RawUnrealLine][]) {
        return {
            [name]: {
                a: results.filter(l => l[2] === 1).map(l => [l[0], l[1]] as RawUnrealLine),
                b: results.filter(l => l[2] < 0).map(l => [l[0], l[1]] as RawUnrealLine),
                diff: results.filter(l => l[2] === 0).map(l => [[l[0], l[1]], l[3]] as [RawUnrealLine, RawUnrealLine])
            }
        } satisfies Partial<ConvertResult>
    }

    public static compareEqualSign (a: RawUnrealLine[], b: RawUnrealLine[], notFound: number) {
        const equalValue = (c: string, d: string) => {
            const is = (x: string, y: string, q: ((x: string) => string)[]) => q.some(p => p(x) === y || p(y) === x)

            return is(c, d, [(x) => x, x => `${x}.0`, x => `"${x}"`, x => x.toLowerCase()])
        }
        return this.compareAll(a, b, (_x, _y) => {
            const x = _x.split('='), y = _y.split('=');

            return x[0] === y[0] ? equalValue(_x.split('=', 2)[1], _y.split('=', 2)[1]) ? 2 : 0 : notFound
        })
    }

    public static compareFirstAndLast (a: RawUnrealLine[], b: RawUnrealLine[], notFound: number) {
        const split = (x: string) => x.split(' ').flatMap(a => a.split('\t'))

        return this.compareAll(a, b, (x, y) => {
            const _x = split(x), _y = split(y)
            const r = (n: string) => n.includes('var (') ? n.replace('var (', 'var(') : n

            return _x.at(-1) === _y.at(-1) ? r(_x[0]) === r(_y[0]) ? 2 : 0 : notFound
        })
            .filter(n => !['ObjCategory', 'ObjName'].some(m => n[0].startsWith(m)))
    }

    public static compareStrictlyEqual (a: RawUnrealLine[], b: RawUnrealLine[], notFound: number) {
        return this.compareAll(a, b, (x, y) => x === y ? 2 : notFound)
    }

    private removeDuplicates <T extends [...RawUnrealLine, number, RawUnrealLine]> (a: T[], b: T[]): T[] {
        return b.concat(a);
    }

    private convertClassComparison (methods: Converter) {
        const { a, b } = this

        return (<(keyof Converter)[]>Object.keys(methods)).reduce((prev, key) => {
            const results = UnrealClassesComparer[methods[key]](a[key], b[key], -1)
                .filter(n => n[2] !== 2)
            const results2 = UnrealClassesComparer[methods[key]](b[key], a[key], 1)
                .filter(n => n[2] !== 2)

            return { ...prev, ...this.convert(key, this.removeDuplicates(results, results2)) }
        }, {} as ConvertResult)
    }

    public compare (): RawUnrealClassCompareResult {
        const { a, b } = this
        
        const methods: Converter = {
            flags: 'compareStrictlyEqual',
            defaultproperties: 'compareEqualSign',
            variables: 'compareFirstAndLast'
        }

        return {
            ...this.convertClassComparison(methods),
            _data: {
                Class: [a.Class, b.Class],
                Extends: [a.Extends, b.Extends],
                ObjectArchetype: [a.ObjectArchetype, b.ObjectArchetype]
            } satisfies { [x: string]: [a: string, b: string] }
        }
    }
}

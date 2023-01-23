import { Actions, Conditions, Variables } from "@kismet.ts/items";

export type NumberType = 'float' | 'integer'

type NumberAction = 
    | 'variable'
    | 'randomVariable'
    | 'multiply'
    | 'divide'
    | 'add'
    | 'subtract'
    | 'cast'
    | 'set'
    | 'compare'
    | 'counter'

export const NumberMap = {
    float: {
        variable: Variables.Float,
        randomVariable: Variables.RandomFloat,
        multiply: Actions.MultiplyFloat,
        divide: Actions.DivideFloat,
        add: Actions.AddFloat,
        subtract: Actions.SubtractFloat,
        cast: Actions.CastToFloat,
        set: Actions.Float,
        compare: Conditions.CompareFloat,
        counter: Conditions.FloatCounter,
    },
    integer: {
        variable: Variables.Integer,
        randomVariable: Variables.RandomInteger,
        multiply: Actions.MultiplyInt,
        divide: Actions.DivideInt,
        add: Actions.AddInt,
        subtract: Actions.SubtractInt,
        cast: Actions.CastToInt,
        set: Actions.Int,
        compare: Conditions.CompareInt,
        counter: Conditions.IntCounter,
    }
};

export type INumberMap = {
    [T in NumberType]: {
        [A in NumberAction]: typeof NumberMap[T][A]
    } 
}

export type NumberVariable<N extends NumberType = NumberType> = InstanceType<INumberMap[N]['variable']>
export type RandomNumberVariable<N extends NumberType = NumberType> = InstanceType<INumberMap[N]['randomVariable']>

export type INumberOperation<T extends NumberType, K extends (keyof INumberMap[NumberType])> = {
    [P in K]: InstanceType<INumberMap[T][P]>
}[K]

export type INumber<N extends NumberType, K extends (keyof INumberMap[N])> = INumberMap[N][K]

export function _get <N extends NumberType, K extends (keyof INumberMap[N])>(type: N, key: K): INumber<N, K> {
    return NumberMap[type][key]
}

// Most of this is jcalz answer, up until the magic.
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void)
    ? I
    : never;

type LastOf<T> =
    UnionToIntersection<T extends any ? () => T : never> extends () => infer R
        ? R
        : never;

type Push<T extends any[], V> = [...T, V];

type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
    true extends N
        ? []
        : Push<TuplifyUnion<Exclude<T, L>>, L>;

// The magic happens here!
export type Tuple<T, A extends T[] = []> =
    TuplifyUnion<T>['length'] extends A['length']
        ? [...A]
        : Tuple<T, [T, ...A]>;
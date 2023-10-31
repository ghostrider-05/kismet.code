import { Items } from "@kismet.ts/items";

const { Actions, Conditions, Variables } = Items

export type NumberType = 'float' | 'integer'

export type NumberAction = 
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
} satisfies Record<NumberType, Record<NumberAction, object>>;

type INumberMap = {
    [T in NumberType]: {
        [A in NumberAction]: typeof NumberMap[T][A]
    } 
}

export type ActionVariable<N extends NumberType, A extends NumberAction> = InstanceType<INumberMap[N][A]>
export type NumberVariable<N extends NumberType = NumberType> = ActionVariable<N, 'variable'>
export type RandomNumberVariable<N extends NumberType = NumberType> = ActionVariable<N, 'randomVariable'>

type INumber<N extends NumberType, K extends NumberAction> = INumberMap[N][K]

export function _get <N extends NumberType, K extends NumberAction> (type: N, key: K): INumber<N, K> {
    return NumberMap[type][key]
}

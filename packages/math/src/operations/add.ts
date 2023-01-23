import { SequenceVariable } from "@kismet.ts/core";
import { Actions, Variables } from '@kismet.ts/items'
import { constructItem } from "@kismet.ts/shared";
import { NumberMap, NumberType, NumberVariable, INumberOperation } from "./INumber";

export type NumberOperation<T extends typeof SequenceVariable> = T extends Variables.Integer
    ? [Variables.Integer, Variables.Integer, Actions.AddInt]
    : [Variables.Float, Variables.Float, Actions.AddFloat]

export function addVariables <T extends NumberType> (type: T, a: NumberVariable, b: NumberVariable) {
    const action = NumberMap[type].add

    const add = new action()
        .setVariable(action.Variables.ValueA, a)
        .setVariable(action.Variables.ValueB, b)

    return [
        a,
        b,
        add
    ] as NumberOperation<T extends 'float' ? typeof Variables.Float : typeof Variables.Integer>
}

export function add <T extends typeof SequenceVariable, N extends NumberType> (instance: T, type: N, a: number, b: number) {
    const varA: NumberVariable = constructItem(instance)
    varA.setValue(a)

    const varB: NumberVariable = constructItem(instance)
    varB.setValue(b)

    return addVariables<N>(type, varA, varB)
}

import { ActionVariable, NumberType, NumberVariable, _get } from "./INumber";

export function addVariables <T extends NumberType> (type: T, a: NumberVariable<T>, b: NumberVariable<T>) {
    const action = _get(type, 'add')

    const add = new action()
        .setVariable(action.Variables.ValueA, a)
        .setVariable(action.Variables.ValueB, b) as ActionVariable<T, 'add'>

    return [
        a,
        b,
        add
    ] as const
}

export function add <N extends NumberType> (type: N, a: number, b: number) {
    const instance = (value: number) => {
        const cls = _get(type, 'variable')
        return new cls().setValue(value) as NumberVariable<N>
    }

    return addVariables<N>(type, instance(a), instance(b))
}

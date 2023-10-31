import { NumberType, NumberVariable, _get } from "./INumber.js";

export function divide <N extends NumberType> (a: NumberVariable<N>, b: NumberVariable<N>, type: N) {
    const divideNode = new (_get(type, 'divide'))()
        .setVariable('A', a)
        .setVariable('B', b)
        
    return [
        divideNode,
    ] as const
}

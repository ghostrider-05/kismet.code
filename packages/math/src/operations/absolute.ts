import { INumber, NumberMap, NumberType, NumberVariable, _get } from "./INumber.js";

export function absolute <N extends NumberType> (n: NumberVariable<N>, type: N) {
    const zeroVar = new (_get(type, 'variable'))()
        .setValue(0) 

    const multiplyNode = new (_get(type, 'multiply'))()
        .setVariable('A', n)
        .setProperty({ name: 'B', value: -1 })

    const compareCond = new (_get(type, 'compare'))()
        .setVariable('A', n)
        .setVariable('B', zeroVar)
        .addOutputConnection({ name: 'A < B' }, { name: 'In', item: multiplyNode })
        
    return [
        zeroVar,
        multiplyNode,
        compareCond
    ] as [
        InstanceType<INumber<N, 'variable'>>,
        InstanceType<INumber<N, 'multiply'>>,
        InstanceType<INumber<N, 'compare'>>,
    ]
}
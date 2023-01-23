import { absolute } from "./operations/absolute";
import { NumberType, NumberVariable } from "./operations/INumber";

function createMathScope <N extends NumberType> (type: N): VariableMath<N> {
    return new VariableMath(type)
}

class VariableMath<N extends NumberType> {
    constructor (protected type: N) {

    }

    public abs (x: NumberVariable<N>) {
        return absolute<N>(x, this.type)
    }
}

export class KismetMath {
    public Integer = createMathScope('integer')
    public Float = createMathScope('float')
}


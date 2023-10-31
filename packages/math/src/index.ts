import type { NumberType, NumberVariable } from "./operations/INumber.js";

import { absolute } from "./operations/absolute.js";
import { add, addVariables } from "./operations/add.js";
import { divide } from "./operations/divide.js";

function createMathScope <N extends NumberType> (type: N): VariableMath<N> {
    return new VariableMath(type)
}

class NumberMath<N extends NumberType> {
    constructor (protected type: N) {

    }

    public add (a: number, b: number) {
        return add(this.type, a, b)
    }
}

class VariableMath<N extends NumberType> {
    public numbers: NumberMath<N>

    constructor (protected type: N) {
        this.numbers = new NumberMath(type)
    }

    public add (a: NumberVariable<N>, b: NumberVariable<N>) {
        return addVariables(this.type, a, b)
    }

    public abs (x: NumberVariable<N>) {
        return absolute<N>(x, this.type)
    }

    public divide (a: NumberVariable<N>, b: NumberVariable<N>) {
        return divide(a, b, this.type)
    }
}

export class KismetMath {
    public Integer = createMathScope('integer')
    public Float = createMathScope('float')
}


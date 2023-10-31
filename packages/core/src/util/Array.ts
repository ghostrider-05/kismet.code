import { 
    SequenceVariable,
    type SequenceItemType,
} from "../structures/index.js";

import type { IKismetSerializeable } from "./IKismetSerializeable.js";

export class KismetArray<I extends SequenceVariable> implements IKismetSerializeable<SequenceVariable[]> {
    public constructor (protected variables: I[]) {

    }

    public get length (): number {
        return this.variables.length
    }

    public at (index: number) {
        return this.variables.at(index)
    }

    public iterate (iterator: (item: I, index: number) => SequenceItemType[]) {
        return this.variables.flatMap((item , i) => iterator(item, i))
    }

    public serialize (): I[] {
        return this.variables;
    }

    public static from <V extends typeof SequenceVariable> (
        variable: V, 
        count: number,
        setName?: (index: number) => string,
    ): KismetArray<InstanceType<V>> {
        const variables = Array.from({ length: count }, (_, index) => {
            const item = new variable(<never>{}) as InstanceType<V>
            const name = setName?.(index)

            return name ? item.setName(name) : item
        })

        return new KismetArray(variables)
    }
}

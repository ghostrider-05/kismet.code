import { SequenceAction } from './Action.js';
import { SequenceVariable } from './Variable.js';

type SequenceItemType = SequenceAction | SequenceVariable

export class Sequence {
    public name: string;
    private items: SequenceItemType[];
    public subSequences: Sequence[];

    constructor (name: string) {
        this.name = name
        this.items = []

        this.subSequences = []
    }

    addItem (item: SequenceItemType): this {
        this.items.push(item)

        return this
    }

    addItems (items: SequenceItemType[]): this {
        this.items = this.items.concat(items)

        return this
    }

    addSubSequence (name: string, objects?: SequenceItemType[]): Sequence {
        const subSequence = new Sequence(name)
            .addItems(objects?.map(x => x.setSequence(name)) ?? [])

        this.subSequences.push(subSequence)

        return subSequence
    }
}

export * from './Action.js'
export * from './Item/index.js'
// export * from './Condition.js'
export * from './Event.js'
export * from './Variable.js'
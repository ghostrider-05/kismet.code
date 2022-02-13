import { 
    BaseItem as Base,
    BaseSequenceItem as BaseItem,
    SequenceNode as Item,
    KismetColor,
    Sequence,
    SequenceAction,
    SequenceCondition,
    SequenceEvent,
    SequenceVariable,
    KismetFile
} from './structures/index.js'

const Structures = {
    Base,
    BaseItem,
    Item,
    Sequence,
    SequenceAction,
    SequenceCondition,
    SequenceEvent,
    SequenceVariable
}

const Util = new class Util {
    Color = KismetColor
}

export {
    KismetFile,
    Structures,
    Util
}

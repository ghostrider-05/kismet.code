import { 
    BaseSequenceItem as BaseItem,
    SequenceNode as Item,
    KismetColor,
    Sequence,
    SequenceAction,
    SequenceEvent,
    SequenceVariable,
    KismetFile
} from './structures/index.js'

const Structures = {
    BaseItem,
    Item,
    Sequence,
    SequenceAction,
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
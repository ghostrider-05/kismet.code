import { 
    BaseSequenceItem as BaseItem,
    SequenceNode as Item,
    KismetColor as Color,
    Comment,
    CommentFrame,
    Sequence,
    SequenceAction,
    SequenceEvent,
    SequenceVariable,
    UDK
} from './structures/index.js'

const Structures = {
    BaseItem,
    Item,
    Sequence,
    SequenceAction,
    SequenceEvent,
    SequenceVariable
}

const baseItems = {
    Comment,
    CommentFrame
}

const Util = new class Util {
    Color = Color
}

export {
    UDK,
    baseItems,
    Structures,
    Util
}
import {
    BaseItem as Base,
    BaseSequenceItem as BaseItem,
    SequenceNode as Item,
    KismetColor,
    Parsers,
    Sequence,
    SequenceAction,
    SequenceCondition,
    SequenceEvent,
    SequenceVariable,
    KismetFile,
} from './structures/index.js'

import { Constants, clipboard } from './shared/index.js'

const Structures = {
    Base,
    BaseItem,
    Item,
    Sequence,
    SequenceAction,
    SequenceCondition,
    SequenceEvent,
    SequenceVariable,
}

const Util = class Util {
    public static Color = KismetColor
    public static clipboard = clipboard
}

export * from './types/index.js'
export { KismetFile, Parsers, Structures, Util, Constants }

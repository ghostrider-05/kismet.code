import { CustomNodesManager } from './managers/index.js'

import {
    TextParserOptions,
    InputTextNodeParser,
    InputTextSequenceParser,
} from './managers/TextManager.js'

export const Parsers = {
    Classes: new CustomNodesManager(),
    NodeText: InputTextNodeParser,
    SequenceText: InputTextSequenceParser,
}

export type { TextParserOptions }

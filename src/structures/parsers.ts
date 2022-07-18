import {
    CustomNodesManager,
    TextParserOptions,
    InputTextNodeParser,
    InputTextSequenceParser,
} from './managers/index.js'

export const Parsers = {
    Classes: new CustomNodesManager(),
    NodeText: InputTextNodeParser,
    SequenceText: InputTextNodeParser,
}

export type { TextParserOptions }

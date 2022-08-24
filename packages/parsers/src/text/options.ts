import type { 
    ISingleStore, 
    SchemaItemNames, 
    SequenceItemType, 
    SequenceOptions 
} from "@kismet.ts/core"

export interface TextParserOptions<T> {
    convertToString?: T
    sequence?: Omit<SequenceOptions<SequenceItemType, SchemaItemNames>, 'name'>
}

export interface TextSequenceParsedItem {
    name: string
    id?: string
    inputName?: string
    outputName?: string
    variables?: string
}

export interface TextSequenceParserOptions<T> extends TextParserOptions<T> {
    variables: ISingleStore
    newLinesSeperation: number
    extractItem: (item: string) => TextSequenceParsedItem
    extractSequenceOrder: (block: string) => string[][]
}

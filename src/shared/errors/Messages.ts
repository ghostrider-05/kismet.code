/* eslint-disable @typescript-eslint/no-explicit-any */
export const Messages = {
    FLOAT_INPUT: 'Value is an integer, not a float',
    INDEX_DEFINED: `This index is already defined in this process. 
        Remove an object with this id or choose a differen index`,
    INTEGER_INPUT: 'Value is an float, not a integer',
    INVALID_COLORS_INPUT: 'Invalid color lenght provided. Expected 4 values',
    INVALID_NODE_ARGUMENT:
        'Invalid item: expected a node (action or condition)',
    INVALID_TYPE: (input: unknown, type: string) =>
        `Expected typeof ${type}, received ${typeof input}: ${input}`,
    PROJECT_DEFINED: 'A project file with this name is already defined',
    RANGE_LOWER_MIN:
        'Invalid value: the minimum value is higher than maximum value in this range.',
    SEQUENCE_DEFINED: `A sequence is already defined and cannot be changed by name. 
        Overwrite the sequence by provide a new sequence structure`,
    SEQUENCE_EMPTY: (name: string) => `Sequence '${name}' is empty`,
    UNKNOWN_CONNECTION: (name: string, obj: string) =>
        `Could not find output connection for '${name}' on ${obj}`
}

export type MessageKey = keyof typeof Messages

export type MessageParams<T extends MessageKey> = typeof Messages[T] extends (
    ...args: any[]
) => any
    ? Parameters<typeof Messages[T]>
    : []

export const Messages: {
    [key: string]: string | ((...args: string[]) => string)
} = {
    INVALID_TYPE: (input: unknown, type: string) =>
        `Expected typeof ${type}, received ${typeof input}: ${input}`,
    SEQUENCE_EMPTY: (name: string) => `Sequence '${name}' is empty`
}

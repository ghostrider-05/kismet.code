export const Messages: {
    [key: string]: string | ((...args: string[]) => string)
} = {
    SEQUENCE_EMPTY: (name: string) => `Sequence '${name}' is empty`
}

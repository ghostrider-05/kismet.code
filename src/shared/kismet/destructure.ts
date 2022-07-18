export function destructureDefaultProperty (input: string) {
    return input
        .slice(1, -1)
        .match(/(?<=,|^)(.*?=.*?)(?=,|$)/gm)
        ?.map((i, _, a) => {
            return i.includes('(')
                ? [i, a[_ + 1]]
                      .join(',')
                      .slice(0, [i, a[_ + 1]].join(',').indexOf('),') + 1)
                : i.includes(')')
                ? i.slice(i.indexOf(')') + 2)
                : i
        })
        .filter(n => n)
        .map(n => n.split('=') as [string, string])
}

export function destructureProperty (rawInput: string): [string, string] {
    const input = rawInput.trim()
    if (input.length === 0) return ['', '']

    if (!input.includes('=')) {
        throw new Error(
            "Unexpected property input. Missing character '=' in line: " + input
        )
    }

    const split = input.indexOf('=')
    return [input.slice(0, split), input.slice(split + 1)]
}

export * from './kismet.js'

export function filterEmptyLines (input: string | string[]): string {
    const output = (Array.isArray(input) ? input : input.split('\n'))
        .filter(line => line.trim() !== '')
        .join('\n')

    return output
}

export function groupByProperty<T extends Record<string, unknown>> (input: T[], propertyName: string): T[][] {
    const output: T[][] = []
    const propertyNames: string[] = []

    input.forEach(item => {
        if (!propertyNames.find(name => name === item[propertyName])) {
            output.push([item])
            propertyNames.push(item[propertyName] as string)
        } else {
            output.find(list => list.length > 0 && list[0][propertyName] === item[propertyName])?.push(item)
        }
    })

    return output
} 

export function mapObjectKeys<T, C> (object: Record<string, T[]>, fn: (obj: T, i: number, array: T[]) => C): C[][] {
    return Object.keys(object).map(key => {
        return (object[key] as T[]).map(fn)
    })
}

export function stringFirstCharUppercase (input: string): string {
    return input[0].toUpperCase() + input.slice(1)
}

export function t<T> (input: unknown): T {
    return (input as T)
}
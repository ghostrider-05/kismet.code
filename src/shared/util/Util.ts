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

type objectType = 'string' | 'array' | 'number' | 'object'

export function isType (type: objectType, input: unknown, keys?: string[]): boolean {
    const validateObjectKeys = (obj: Record<string, unknown>) => keys ? keys.every((n, i) => {
        if (obj[n] == undefined) {
            throw new Error(`[${i}]: Missing required key ${n}`)
        } else return true
    }) : true

    if (input == undefined) return true
    let isValid = true

    switch (type) {
        case 'string':
            if (typeof input !== 'string') throw new Error(`Expected typeof ${type}, received ${typeof input}: ${input}`)
            break
        case 'array': 
            if (!Array.isArray(input)) throw new Error(`Expected typeof array, received ${typeof input}: ${input}`)
            isValid = input.length > 0 ? input.every(n => validateObjectKeys(n)) : true
            break
        case 'number':
            if (isNaN(input as number)) throw new Error(`Expected typeof number, received ${typeof input}: ${input}`)
            isValid = isNaN(input as number)
            break
        case 'object':
            isValid = typeof input === 'object' && validateObjectKeys(input as Record<string, unknown>)
            if (!isValid) throw new Error (`Invalid type for object, received type ${typeof input}`)
            break
    }

    return isValid
}

export function mapObjectKeys<T, C> (object: Record<string, T[]>, fn: (obj: T, i: number, array: T[]) => C): C[][] {
    return Object.keys(object).map(key => {
        return (object[key] as T[]).map(fn)
    })
}

export function quote (value: string): string {
    return `"${value}"` 
}

export function stringFirstCharUppercase (input: string): string | null {
    if (!input) return null
    return input[0].toUpperCase() + input.slice(1)
}

export function t<T> (input: unknown): T {
    return (input as T)
}

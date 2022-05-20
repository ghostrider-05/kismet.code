import clipboardy from 'clipboardy'

import { KismetError } from '../errors/index.js'

import { ArrayUnion } from '../../types/index.js'

export function arrayUnionInput<T> (input: ArrayUnion<T>): T[] {
    return Array.isArray(input) ? input : [input]
}

export function filterEmptyLines (input: string | string[]): string {
    if (!input) return ''
    const output = (Array.isArray(input) ? input : input.split('\n'))
        .filter(line => line.trim() !== '')
        .join('\n')

    return output
}

export function groupByProperty<T extends Record<string, unknown>> (
    input: T[],
    propertyName: keyof T
): T[][] {
    const output: T[][] = []
    const propertyNames: string[] = []

    input.forEach(item => {
        if (!propertyNames.find(name => name === item[propertyName])) {
            output.push([item])
            propertyNames.push(item[propertyName] as string)
        } else {
            output
                .find(
                    list =>
                        list.length > 0 &&
                        list[0][propertyName] === item[propertyName]
                )
                ?.push(item)
        }
    })

    return output
}

type objectType = 'string' | 'array' | 'number' | 'object'

const validateObjectKeys = (obj: Record<string, unknown>, keys?: string[]) =>
    keys
        ? keys.every((n, i) => {
              if (obj[n] == undefined) {
                  throw new Error(`[${i}]: Missing required key ${n}`)
              } else return true
          })
        : true

export function isType (
    type: objectType,
    input: unknown,
    keys?: string[]
): boolean {
    if (input == undefined) return true
    let isValid = true

    switch (type) {
        case 'string':
            isValid = typeof input === 'string'
            break
        case 'array':
            isValid =
                Array.isArray(input) &&
                (input.length > 0
                    ? input.every(n => validateObjectKeys(n, keys))
                    : true)
            break
        case 'number':
            isValid = !isNaN(input as number)
            break
        case 'object':
            isValid =
                typeof input === 'object' &&
                validateObjectKeys(input as Record<string, unknown>, keys)
            break
        default:
            isValid = true
    }

    if (!isValid) throw new KismetError('INVALID_TYPE', [input, type])
    return isValid
}

export function mapObjectKeys<T, C> (
    object: Record<string, T[]>,
    fn: (obj: T, i: number, array: T[]) => C
): C[][] {
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
    return input as T
}

export const clipboard = class ClipboardUtil {
    public static async read (): Promise<string> {
        return await clipboardy.read()
    }

    public static async write (input: string): Promise<void> {
        return await clipboardy.write(input)
    }
}

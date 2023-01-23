import { KismetError } from '../error/index.js'
import type { ArrayUnion } from './types.js'

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

export function filterMultipleEmptyLines (content: string): string {
    //https://stackoverflow.com/questions/21817453/replace-multiple-blank-lines-in-text-using-javascript
    const EOL = content.match(/\r\n/gm) ? '\r\n' : '\n'
    const regExp = new RegExp(`(${EOL}){3,}`, 'gm')
    
    return content.replace(regExp, EOL + EOL)
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
    let isValid: boolean

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

/**
 * Map over the keys of an object. 
 * 
 * Can be seen as `object[string].map(fn)`
 * @param object 
 * @param fn 
 */
export function mapObjectKeys<T, C> (
    object: Record<string, T[]>,
    fn: (obj: T, i: number, array: T[]) => C
): C[][] {
    return Object.keys(object).map(key => {
        return (object[key] as T[]).map(fn)
    })
}

/**
 * Create an indent with 4 spaces
 * @param [repeat=1] The amount of indents
 */
export function indent (repeat = 1) {
    return '   '.repeat(repeat)
}

/**
 * Surround the value with " quotes
 * @param value 
 */
export function quote (value: string): string {
    return `"${value}"`
}

export function capitalize (input?: string): string | null {
    if (!input) return null
    return input[0].toUpperCase() + input.slice(1)
}

export function cast<T> (input: unknown, type?: 'boolean' | 'number'): T {
    if (!type) return input as T
    else {
        switch (type) {
            case 'boolean':
                return cast(
                    ['true', 'false'].includes(<never>input)
                        ? input === 'true'
                        : Boolean(input)
                )
            case 'number':
                return cast(Number(input))
        }
    }
}

export function pick <
    T extends Record<string, unknown>, 
    K extends (keyof T)[]
> (obj: T, keys: K): Pick<T, K[number]> {
    const objKeys = Object.keys(obj).filter(key => keys.includes(key)) as K

    return objKeys.reduce((output, currentKey) => {
        return {
            ...output,
            [currentKey]: obj[currentKey]
        }
    }, {} as Pick<T, K[number]>)
}

export function pickExclude <
    T extends Record<string, unknown>, 
    K extends (keyof T)[]
> (obj: T, keys: K): Pick<T, Exclude<keyof T, K[number]>> {
    const includedKeys = Object
        .keys(obj)
        .filter(key => !keys.includes(key)) as Exclude<keyof T, K[number]>[]

    return pick(obj, includedKeys)
}

export const typeguards = {
    isBoolean: (t: unknown): t is boolean => typeof t === 'boolean',
    isString: (t: unknown): t is string => typeof t === 'string'
}
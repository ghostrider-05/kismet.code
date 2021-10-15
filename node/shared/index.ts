import type { KismetVariablesType } from '../types/index.js'

export const KISMET_CONNECTION_SPACE = 21
export const KISMET_VARIABLE_OFFSET = 50
export const KISMET_OUTPUT_OFFSET = 5

export const KISMET_LINE_INDENT = '   '

export const KISMET_NODE_LINES = {
    begin: (name: string, Class: string): string => `Begin Object Class=${Class} Name=${name}`,
    end: 'End Object'
}

export function filterEmptyLines (input: string | string[]): string {
    const output = (Array.isArray(input) ? input : input.split('\n'))
        .filter(line => line.trim() !== '')
        .join('\n')

    return output
}

export function mapObjectKeys<T, C>(object: Record<string, T[]>, fn: (obj: T, i: number, array: T[]) => C): C[][] {
    return Object.keys(object).map(key => {
        return (object[key] as T[]).map(fn)
    })
}

export function t<T>(input: unknown): T {
    return (input as T)
}

export function addVariable (node: string, variable: [string, string][]): string {

    return node.split('\n').flatMap((line, index) => {
        return index === 0 ? [
            line, 
        ].concat(variable.map(v => parseVar(v[0], v[1]))) : line
    }).join('\n')
}

export function boolToKismet (input: boolean | null): string {
    return input ? 'True' : 'False'
}

export function parseVar (name: string, value: KismetVariablesType): string {
    if (value == null) return ''
    
    const stringValue = typeof value === 'number' ? value.toString() : value

    return KISMET_LINE_INDENT + `${name}=${stringValue}`
}
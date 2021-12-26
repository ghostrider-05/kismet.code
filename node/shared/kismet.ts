import {
    KISMET_LINE_INDENT,
    KismetBoolean
} from './constants.js'

import type { 
    KismetVariableInternalTypeList, 
    KismetVariablesType 
} from '../types/index.js'

export function addVariable (node: string, variable: KismetVariableInternalTypeList): string {

    return node.split('\n').flatMap((line, index) => {
        return index === 0 ? [
            line, 
        ].concat(variable.map(v => parseVar(v[0], v[1]))) : line
    }).join('\n')
}

export function boolToKismet (input: boolean | string | null): string {
    if (typeof input === 'string') {
        const output = input === 'true' ? KismetBoolean.True : (
            input === 'false' ? KismetBoolean.False : undefined
        )

        if (output != undefined) return output
        else throw new Error('Unexpected boolean input: ' + input)
    }

    return input ? KismetBoolean.True : KismetBoolean.False
}

export function arrayFromText (input: string): [string, string][] {
    if (input[0] !== '(' || input.at(-1) !== ')') {
        throw new Error('Invalid input array: ' + input)
    }

    const values = input.slice(1, -1)

    if (values.includes('LinkedVariables') || values.includes('LinkedOp')) {
        // Handle variable and input/output link arrays
        return values.split(/(?<!LinkedOp)=/g).map((line, i, lines) => {
            if ((i + 1) < lines.length) {
                const index = line.lastIndexOf(',')
                const name = index > 0 ? line.slice(index + 1) : line
                    
                const nextIndex = lines[i + 1].lastIndexOf(',')
                const value = nextIndex > 0 ? lines[i + 1].slice(0, nextIndex) : lines[i + 1]

                return [name, value]
            } else return null
        }).filter(n => n) as [string, string][]
    } else {
        return values.split(',').map(n => propertyFromText(n))
    }
}

export function propertyFromText (rawInput: string): [string, string] {
    const input = rawInput.trim()
    
    if (!input.includes('=')) {
        throw new Error('Unexpected property input. Missing character \'=\' in line: ' + input)
    }

    const split = input.indexOf('=')
    return [input.slice(0, split), input.slice(split + 1)]
}

export function parseVar (name: string, value: KismetVariablesType): string {
    if (value == null) return ''
    
    const stringValue = typeof value === 'number' ? value.toString() : value

    return KISMET_LINE_INDENT + `${name}=${stringValue}`
}
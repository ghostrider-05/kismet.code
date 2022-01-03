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

export function boolToKismet (input: boolean | null): string {
    return input ? KismetBoolean.True : KismetBoolean.False
}

export function parseVar (name: string, value: KismetVariablesType): string {
    if (value == null) return ''
    
    const stringValue = typeof value === 'number' ? value.toString() : typeof value === 'boolean' ? boolToKismet(value) : value

    return KISMET_LINE_INDENT + `${name}=${stringValue}`
}
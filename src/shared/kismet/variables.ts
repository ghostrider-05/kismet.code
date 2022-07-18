import { KISMET_LINE_INDENT, KismetBoolean } from '../util/Constants.js'

import type { KismetVariableValue } from '../../types/index.js'

export function addVariable (
    node: string,
    variables: [string, KismetVariableValue][]
): string {
    return node
        .split('\n')
        .flatMap((line, index, lines) => {
            return index === lines.length - 2
                ? [line].concat(
                      variables.map(([name, value]) => parseVar(name, value))
                  )
                : line
        })
        .join('\n')
}

export function boolToKismet (input: boolean | null): string {
    return input ? KismetBoolean.True : KismetBoolean.False
}

export function parseVar (name: string, value: KismetVariableValue): string {
    if (value == null) return ''

    const stringValue =
        typeof value === 'number'
            ? value.toString()
            : typeof value === 'boolean'
            ? boolToKismet(value)
            : value

    return KISMET_LINE_INDENT + `${name}=${stringValue}`
}

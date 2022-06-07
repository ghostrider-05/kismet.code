import { Constants } from '../../../shared/index.js'

import type { Enum, If } from '../../../types/index.js'

const defaultType = (value: string) => {
    if (['True', 'False'].includes(value)) return 'BoolProperty'
    else if (!isNaN(parseInt(value))) {
        return value.includes('.') ? 'FloatProperty' : 'IntProperty'
    } else return 'StringProperty'
}

export const defaultVariables = () => {
    const base: [string, string][] = [
        ['ObjComment', `''`],
        ['bOutputObjCommentToScreen', 'False'],
        ['bSuppressAutoComment', 'True'],
    ]

    const breakpoint: [string, string] = ['breakpoint', 'False']
    const varName: [string, string] = ['Varname', `''`]
    const event: [string, string][] = [
        ['MaxTriggerCount', '0'],
        ['ReTriggerDelay', '0.00'],
        ['bEnabled', 'True'],
        ['Priority', '0'],
        ['bPlayerOnly', 'True'],
        ['bClientsideOnly', 'False'],
    ]

    return {
        base,
        breakpoint,
        event,
        varName,
    }
}

const defaultNodeItems = (type: string) => {
    const { base, breakpoint, event, varName } = defaultVariables()
    const output = []

    switch (type) {
        // Add targets
        case Constants.NodeType.ACTIONS:
        case Constants.NodeType.CONDITIONS:
            output.push(breakpoint)
            break
        case Constants.NodeType.VARIABLES:
            output.push(varName)
            break
        case Constants.NodeType.EVENTS:
            output.push(...event)
            break
        case 'base':
            output.push(...base)
            break
    }

    return output
}

export const defaultNodeVariables = <T extends boolean = true>(
    type: Enum<Constants.NodeType> | 'base',
    format?: T
): If<T, string, [string, string][]> => {
    const output = defaultNodeItems(type).concat(defaultNodeItems('base'))

    return (
        format ?? true
            ? output
                  .map(n => {
                      return `    ${n[0]}: bpy.props.${defaultType(
                          n[1]
                      )}(name='${n[0]}', default=${n[1]})\n`
                  })
                  .join('')
            : output
    ) as If<T, string, [string, string][]>
}

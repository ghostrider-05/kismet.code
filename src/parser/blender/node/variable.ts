import { quote, Constants } from '../../../shared/index.js'

import type { Enum, If, UnrealJsonReadFileNode } from '../../../types/index.js'

const variableTypes: [[string, string, string], [string, string]][] = [
    [
        ["Class'Engine.SeqVar_Float'", "class'SeqVar_Float'", 'float'],
        ['NodeSocketFloat', 'FloatProperty']
    ],
    [
        ["class'SeqVar_Int'", "Class'Engine.SeqVar_Int'", 'int'],
        ['NodeSocketInt', 'IntProperty']
    ],
    [
        ["Class'Engine.SeqVar_Bool'", "class'SeqVar_Bool'", 'bool'],
        ['NodeSocketBool', 'BoolProperty']
    ],
    [
        ["Class'Engine.SeqVar_Vector'", "class'SeqVar_Vector'", 'Vector'],
        [
            'NodeSocketVector',
            'StringProperty' // TODO: use vector property
        ]
    ]
]

const defaultVariable = ['NodeSocketString', 'StringProperty']

export const variableBlenderType = (type?: string) => {
    const [socket, Class] =
        variableTypes.find(variable => {
            return variable[0].some(t => t === type)
        })?.[1] ?? defaultVariable

    return {
        socket,
        Class
    }
}

export const formatVariables = (node: UnrealJsonReadFileNode) => {
    const staticVariables = node.variables
        .map(variable => {
            const { Class } = variableBlenderType(variable.type)
            const defaultValue = node.defaultproperties.find(
                prop => prop.name === variable.name
            )?.value

            const defaultString = defaultValue
                ? `,default=${
                      defaultValue.startsWith('(') || defaultValue.includes('.')
                          ? Class === defaultVariable[1]
                              ? quote(defaultValue)
                              : defaultValue
                          : defaultValue === 'true' || defaultValue === 'false'
                          ? ['True', 'False'].find(
                                bool => bool.toLowerCase() === defaultValue
                            )
                          : // TODO: check for now after every update
                            [
                                'chassis_jnt',
                                'CustomColor',
                                'Default',
                                'DefaultEvent',
                                'Shake0'
                            ]
                                .map(n =>
                                    n === defaultValue
                                        ? quote(defaultValue)
                                        : undefined
                                )
                                .filter(n => n)?.[0] ?? defaultValue
                  }`
                : ''

            return `    ${variable.name}: bpy.props.${Class}(name="${variable.name}"${defaultString})`
        })
        .join('\n')

    return staticVariables
}

export const formatVariableSockets = (node: UnrealJsonReadFileNode) => {
    const prefix = '        '
    const sockets = node.variables
        .map(variable => {
            return prefix + `layout.prop(self, "${variable.name}")`
        })
        .join('\n')

    const variableSockets = sockets.concat(
        `\n${prefix}defaults = layout.box()`,
        `\n${prefix}label_text = self.KismetType[0].upper() + self.KismetType[1:-1] + ' Properties'`,
        `\n${prefix}defaults.label(text=label_text)`,
        ...defaultNodeVariables(node.type, false).map(([name]) => {
            return `\n${prefix}defaults.prop(self, '${name}')`
        })
    )

    return `    def draw_buttons_ext(self, context, layout):\n${variableSockets}`
}

const defaultType = (value: string) => {
    if (['True', 'False'].includes(value)) return 'BoolProperty'
    else if (!isNaN(parseInt(value))) {
        return value.includes('.') ? 'FloatProperty' : 'IntProperty'
    } else return 'StringProperty'
}

const defaultVariables = () => {
    const base: [string, string][] = [
        ['ObjComment', `''`],
        ['bOutputObjCommentToScreen', 'False'],
        ['bSuppressAutoComment', 'True']
    ]

    const breakpoint: [string, string] = ['breakpoint', 'False']
    const varName: [string, string] = ['Varname', `''`]
    const event: [string, string][] = [
        ['MaxTriggerCount', '0'],
        ['ReTriggerDelay', '0.00'],
        ['bEnabled', 'True'],
        ['Priority', '0'],
        ['bPlayerOnly', 'True'],
        ['bClientsideOnly', 'False']
    ]

    return {
        base,
        breakpoint,
        event,
        varName
    }
}

export const defaultNodeVariables = <T extends boolean = true>(
    type: Enum<Constants.NodeType>,
    format?: T
): If<T, string, [string, string][]> => {
    const { base, breakpoint, event, varName } = defaultVariables()
    const output = base

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
    }

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

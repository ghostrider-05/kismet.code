import { defaultNodeVariables, defaultVariables } from './defaultVariable.js'
import { quote, Constants } from '@kismet.ts/shared'

import type {
    UnrealJsonReadFile,
    UnrealJsonReadFileNode,
} from '../../extractor/files.js'

const variableTypes: [[string, string, string], [string, string]][] = [
    [
        ["Class'Engine.SeqVar_Float'", "class'SeqVar_Float'", 'float'],
        ['NodeSocketFloat', 'FloatProperty'],
    ],
    [
        ["class'SeqVar_Int'", "Class'Engine.SeqVar_Int'", 'int'],
        ['NodeSocketInt', 'IntProperty'],
    ],
    [
        ["Class'Engine.SeqVar_Bool'", "class'SeqVar_Bool'", 'bool'],
        ['NodeSocketBool', 'BoolProperty'],
    ],
    [
        ["Class'Engine.SeqVar_Object'", "class'SeqVar_Object'", 'Object'],
        ['NodeSocketObject', 'PointerProperty'],
    ],
    [
        ["Class'Engine.SeqVar_Vector'", "class'SeqVar_Vector'", 'Vector'],
        [
            'NodeSocketVector',
            'StringProperty', // TODO: use vector property
        ],
    ],
]

const defaultVariable = ['NodeSocketString', 'StringProperty', undefined]

export const variableBlenderType = (
    classes: Partial<UnrealJsonReadFile>[],
    type?: string
) => {
    const formatEnum = (type: string) => {
        const enumName = type.split('.')[1]
        const values =
            classes.find(x => x.enums?.[enumName])?.enums?.[enumName] ??
            classes.find(x => x.name === type.split('.')[0])?.enums?.[enumName]

        const value = values
            ?.filter(n => !n.endsWith('_MAX'))
            .map(name => `('${enumName}.${name}', "${name}", "")`)
            ?.join(',')
        return values ? `${enumName}Enum = (${value})` : ''
    }

    const [socket, Class, list] =
        variableTypes.find(variable => {
            return variable[0].some(t => t === type)
        })?.[1] ??
        (type?.includes('.')
            ? // Likely an enum property
              ['NodeSocketString', 'EnumProperty', formatEnum(type)]
            : undefined) ??
        defaultVariable

    return {
        socket,
        Class,
        list,
    }
}

export const formatVariables = (
    node: UnrealJsonReadFileNode,
    classes: Partial<UnrealJsonReadFile>[],
    returnNames?: boolean
) => {
    const names: string[] = []

    const staticVariables = node.variables
        .filter(n => n.category !== null)
        .map(variable => {
            if (
                node.type === Constants.NodeType.EVENTS &&
                variable.name === 'Instigator'
            )
                return ''

            const { Class, list } = variableBlenderType(classes, variable.type)
            const defaultValue = node.defaultproperties.find(
                prop => prop.name === variable.name
            )?.value

            const defaultString =
                defaultValue && !list && Class !== 'VectorProperty' // TODO: Update
                    ? `,default=${
                          defaultValue.startsWith('(') ||
                          defaultValue.includes('.')
                              ? Class === defaultVariable[1]
                                  ? quote(defaultValue)
                                  : defaultValue
                              : defaultValue === 'true' ||
                                defaultValue === 'false'
                              ? ['True', 'False'].find(
                                    bool => bool.toLowerCase() === defaultValue
                                )
                              : // TODO: check for now after every update
                                [
                                    'chassis_jnt',
                                    'CustomColor',
                                    'Default',
                                    'DefaultEvent',
                                    'Shake0',
                                ]
                                    .map(n =>
                                        n === defaultValue
                                            ? quote(defaultValue)
                                            : undefined
                                    )
                                    .filter(n => n)?.[0] ?? defaultValue
                      }`
                    : ''

            names.push(variable.name)

            const type =
                Class === 'PointerProperty' ? ',type=bpy.types.Object' : ''
            const items = list
                ? `,items=${variable.type.split('.')[1]}Enum`
                : ''
            return (
                (list ? `    ${list}\n` : '') +
                `    ${variable.name}: bpy.props.${Class}(name="${variable.name}"${defaultString}${type}${items})`
            )
        })
        .join('\n')

    return returnNames ? names : staticVariables
}

export const formatVariableNames = (
    node: UnrealJsonReadFileNode,
    classes: Partial<UnrealJsonReadFile>[]
) => {
    const nodeNames = <string[]>formatVariables(node, classes, true)
    const { event, varName } = defaultVariables()
    const defaultNodeNames = defaultNodeVariables(node.type, false)
    const defaultNames = [varName[0], ...event.map(n => n[0])].filter(n =>
        defaultNodeNames.some(m => m[0] === n)
    )

    const names = nodeNames.concat(defaultNames)
    if (names.length === 0) return ''
    else
        return `    _SequenceItemVariableNames = [${names
            .map(quote)
            .join(', ')}]`
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

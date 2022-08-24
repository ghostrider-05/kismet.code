import { isPlaceableClass } from '../../utils/ClassManager.js'
import { variableBlenderType } from './variable.js'

import type { UnrealJsonReadFile } from '../../extractor/files.js'

const template = (
    name: string,
    properties: Readonly<[string, string, string | undefined]>[]
) => `
class ${name}(bpy.types.PropertyGroup):
${properties.map(p => `   ${p[0]}: bpy.props.${p[1]}(${p[2] ?? ''})`).join('\n')}
`

export function resolveArrayType (input: string) {
    return input.includes('array<')
        ? input
              .slice('array<'.length + 1, -1)
              .split(' ')
              .filter(n => n)
              .at(-1)
        : undefined
}

function resolveStructure (
    name: string,
    classes: Partial<UnrealJsonReadFile>[],
    includeClasses = true
) {
    const findName = (s: { name?: string }) => s.name === name

    const struct =
        (includeClasses ? classes.find(findName) : undefined) ??
        classes
            .find(item => item.structures?.find(findName))
            ?.structures?.find(findName)

    const variables =
        struct && 'properties' in struct ? struct.properties : struct?.variables

    if (!variables) return

    return variables.filter(n => n.category !== null)
}

export function formatStructure (
    name: string,
    classes: Partial<UnrealJsonReadFile>[]
) {
    const variables = resolveStructure(name, classes, true)
    if (!variables) {
        console.log(`Unable to resolve structure ${name}`)
        return ''
    }
    if (isPlaceableClass(name, classes)) return ''
    console.log(`Resolved structure ${name}`)

    const properties = variables.map(v => {
        const { Class, list } = variableBlenderType(classes, v.type)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return [v.name, Class!, list ? `    items=${list}` : undefined] as const
    })

    return template(name, properties)
}

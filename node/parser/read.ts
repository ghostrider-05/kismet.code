import {
    KISMET_NODE_TYPES,
    KISMET_PROPERTY_NAMES,
    stringFirstCharUppercase,
    t
} from '../shared/index.js'

// TODO: add types for node json structure
export function readNodeFile (json: Record<string, unknown>): Record<string, string | Record<string, string[]> | Record<string, string>[]> {
    const defaultProperty = (name: string) => t<{ name: string, value: string }[]>(defaultproperties).find(x => x.name === name)?.value ?? ''
    const filterRecordList = (list: Record<string, string>[], start: string) => list.filter(n => n.name.startsWith(start)).map(x => x.value)

    const Class = t<string>(json.name)
    const defaultproperties = t<Record<string, string>[]>(json.defaultproperties)
    const variables = t<Record<string, string>[]>(json.variables)

    const name = stringFirstCharUppercase(defaultProperty(KISMET_PROPERTY_NAMES.NAME))
    const Package = defaultProperty(KISMET_PROPERTY_NAMES.CLASS)

    const enums = {
        // TODO: fix indent size
        variables: variables.length > 0 ? ['static Variables = {', variables.map(v => `    ${v.name}:'${v.name}'`).join(',\n'), '}'] : []
    }

    const staticProperties = enums.variables.length > 0 ? enums.variables.map(c => `    ${c}`).join('\n') : ''

    return {
        name: name.replaceAll('"', ''),
        Class,
        variables,
        Package,
        defaultproperties,
        type: KISMET_NODE_TYPES.get(Class as string) ?? '',
        archetype: `"${Class}'${Package}.Default__${Class}'"`,
        staticProperties,
        links: {
            input: filterRecordList(defaultproperties, 'InputLinks('),
            output: filterRecordList(defaultproperties, 'OutputLinks('),
            variable: filterRecordList(defaultproperties, 'VariableLinks(')
        }
    }
}
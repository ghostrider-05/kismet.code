import {
    Constants,
    stringFirstCharUppercase,
    isType
} from '../shared/index.js'

import type { 
    RawUnrealJsonDefaultVariables, 
    RawUnrealJsonFile,
    RawUnrealJsonVariable,
    UnrealJsonReadFile
} from '../types/index.js'

const { 
    KISMET_CLASSES_PREFIXES,
    NodeProperty 
} = Constants

const propertiesUtil = class {
    properties: RawUnrealJsonDefaultVariables[]

    constructor (properties: RawUnrealJsonDefaultVariables[]) {
        this.properties = properties
    }

    get (name: string) {
        return this.properties.find(prop => prop.name === name)?.value ?? ''
    }

    filter(startString: string) {
        return this.properties.filter(prop => prop.name.startsWith(`${startString}(`)).map(x => x.value)
    }
}

function getStaticProperties (variables: RawUnrealJsonVariable[]) {
    const enums = {
        // TODO: fix indent size
        variables: variables.length > 0 ? ['static Variables = {', variables.map(v => `    ${v.name}:'${v.name}'`).join(',\n'), '}'] : []
    }

    const staticProperties = enums.variables.length > 0 ? enums.variables.map(c => `    ${c}`).join('\n') : ''

    return staticProperties
}

export function _validateNodeInput (json: Record<string, unknown>): boolean {
    return isType('string', json.name) 
        && isType('string', json.extends)
        && isType('string', json.extendswithin)
        && isType('array', json.variables, ['flags', 'replicated', 'name', 'type'])
        && isType('array', json.defaultproperties, ['name'])
        && isType('object', json.enums)
        && isType('array', json.constants, ['name', 'value'])
}

export function readNodeFile (json: RawUnrealJsonFile, Package: string): UnrealJsonReadFile {
    const { name: Class, variables, defaultproperties } = json

    const defaultProperties = new propertiesUtil(defaultproperties)

    const name = stringFirstCharUppercase(defaultProperties.get(NodeProperty.NAME))
    const category = defaultProperties.get(NodeProperty.CATEGORY)

    const staticProperties = getStaticProperties(variables)

    return {
        name: name?.replaceAll('"', '').split(' ').join('').replace('?', '') ?? Class,
        Class,
        Package,
        variables,
        category,
        defaultproperties,
        type: KISMET_CLASSES_PREFIXES.find(n => Class.startsWith(n.prefix))?.type ?? '',
        archetype: `"${Class}'${Package}.Default__${Class}'"`,
        staticProperties,
        links: {
            input: defaultProperties.filter(NodeProperty.LINKS_INPUT),
            output: defaultProperties.filter(NodeProperty.LINKS_OUTPUT),
            variable: defaultProperties.filter(NodeProperty.LINKS_VARIABLE)
        }
    }
}
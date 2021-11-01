import {
    KISMET_NODE_TYPES,
    KISMET_PROPERTY_NAMES,
    stringFirstCharUppercase,
} from '../shared/index.js'

import type { 
    RawUnrealJsonDefaultVariables, 
    RawUnrealJsonFile,
    RawUnrealJsonVariable,
    UnrealJsonReadFile
} from '../types/index.js'

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

export function readNodeFile (json: RawUnrealJsonFile, Package: string): UnrealJsonReadFile {
    const { name: Class, variables, defaultproperties } = json

    const defaultProperties = new propertiesUtil(defaultproperties)

    const name = stringFirstCharUppercase(defaultProperties.get(KISMET_PROPERTY_NAMES.NAME))
    const category = defaultProperties.get(KISMET_PROPERTY_NAMES.CLASS)

    const staticProperties = getStaticProperties(variables)

    return {
        name: name.replaceAll('"', ''),
        Class,
        variables,
        category,
        defaultproperties,
        type: KISMET_NODE_TYPES.get(Class as string) ?? '',
        archetype: `"${Class}'${Package}.Default__${Class}'"`,
        staticProperties,
        links: {
            input: defaultProperties.filter('InputLinks'),
            output: defaultProperties.filter('OutputLinks'),
            variable: defaultProperties.filter('VariableLinks')
        }
    }
}
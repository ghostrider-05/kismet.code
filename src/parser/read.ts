import { Constants, stringFirstCharUppercase } from '../shared/index.js'

import type {
    RawUnrealJsonDefaultVariables,
    RawUnrealJsonFile,
    RawUnrealJsonVariable,
    UnrealJsonReadFile
} from '../types/index.js'

const { KISMET_CLASSES_PREFIXES, NodeProperty } = Constants

const propertyMap = class {
    private properties: RawUnrealJsonDefaultVariables[]

    constructor (properties: RawUnrealJsonDefaultVariables[]) {
        this.properties = properties
    }

    get (name: string) {
        return this.properties.find(prop => prop.name === name)?.value ?? ''
    }

    filter (startString: string) {
        return this.properties
            .filter(prop => prop.name.startsWith(`${startString}(`))
            .map(x => x.value)
    }
}

function getStaticProperties (variables: RawUnrealJsonVariable[]) {
    const enums = {
        // TODO: add remaining connections
        variables:
            variables.length > 0
                ? [
                      'static Variables = {',
                      variables
                          .map(
                              (v, i) =>
                                  `${i > 0 ? '\t' : ''}\t${v.name}:'${v.name}'`
                          )
                          .join(',\n'),
                      '}'
                  ]
                : []
    }

    const staticProperties =
        enums.variables.length > 0
            ? enums.variables.map(c => `    ${c}`).join('\n')
            : ''

    return staticProperties
}

const nodeLinkDescriptions = (links: string[]) =>
    links.map(link => ({
        name: link.match(/(?<=LinkDesc=)(.*?)(?=,)/g)?.[0] as string
    }))

const nodeLinkVariables = (links: string[]) =>
    links.map(link => ({
        ...nodeLinkDescriptions([link]),
        expectedType: link.match(/(?<=ExpectedType=)(.*?)(?=,)/g)?.[0] as string
    }))

export function readNodeFile (
    json: RawUnrealJsonFile,
    Package: string
): UnrealJsonReadFile {
    const { name: Class, variables, defaultproperties } = json

    const defaultProperties = new propertyMap(defaultproperties)

    const name = stringFirstCharUppercase(
        defaultProperties.get(NodeProperty.NAME)
    )
    const category = defaultProperties.get(NodeProperty.CATEGORY)

    const staticProperties = getStaticProperties(variables)

    return {
        name:
            name?.replaceAll('"', '').split(' ').join('').replace('?', '') ??
            Class,
        Class,
        Package,
        variables,
        category,
        defaultproperties,
        type:
            KISMET_CLASSES_PREFIXES.find(n => Class.startsWith(n.prefix))
                ?.type ?? '',
        archetype: `"${Class}'${Package}.Default__${Class}'"`,
        staticProperties,
        links: {
            input: defaultProperties.filter(NodeProperty.LINKS_INPUT),
            output: defaultProperties.filter(NodeProperty.LINKS_OUTPUT),
            variable: defaultProperties.filter(NodeProperty.LINKS_VARIABLE)
        }
    }
}

const isDefaultProperty = (name: string): boolean => {
    return (
        name.includes(Constants.NodeProperty.LINKS_INPUT) ||
        name.includes(Constants.NodeProperty.LINKS_OUTPUT) ||
        name.includes(Constants.NodeProperty.LINKS_VARIABLE) ||
        name === Constants.NodeProperty.NAME ||
        name === Constants.NodeProperty.CATEGORY
    )
}

export function nodeToJSON (node: UnrealJsonReadFile): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { staticProperties, defaultproperties, links, ...json } = node

    const inputLinks = nodeLinkDescriptions(links.input),
        outputLinks = nodeLinkDescriptions(links.output),
        variableLinks = nodeLinkVariables(links.variable)

    const props = defaultproperties
        .map(prop => {
            const { name, value } = prop

            return isDefaultProperty(name) || !value ? null : prop
        })
        .filter(n => n)

    const displayName = defaultproperties.find(
        x => x?.name === Constants.NodeProperty.NAME
    )?.value

    return {
        ...json,
        displayName,
        defaultproperties: props,
        links: {
            input: inputLinks,
            output: outputLinks,
            variable: variableLinks
        }
    }
}

import { Constants, capitalize } from '../shared/index.js'

import {
    convertNodeName,
    getStaticProperties,
    NodeProperties,
    nodeLinks,
} from './utils/read.js'

import type {
    RawUnrealJsonConstant,
    RawUnrealJsonFile,
    UnrealJsonReadFile,
    UnrealJsonReadFileNode,
} from '../types/index.js'

const { KISMET_CLASSES_PREFIXES, NodeProperty } = Constants

export function readNodeFile (
    json: RawUnrealJsonFile,
    Package: string
): UnrealJsonReadFile {
    const {
        name: Class,
        extends: Extends,
        structs: structures,
        variables,
        defaultproperties,
        placeable,
        enums,
    } = json

    const defaultProperties = new NodeProperties(defaultproperties)

    const name = capitalize(defaultProperties.get(NodeProperty.NAME))
    const category = defaultProperties.get(NodeProperty.CATEGORY)

    const staticProperties = getStaticProperties(variables)

    return {
        name: convertNodeName(name) ?? Class,
        Class,
        Extends,
        structures,
        Package,
        placeable,
        enums,
        variables,
        category,
        defaultproperties,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        type:
            KISMET_CLASSES_PREFIXES.find(n => Class.startsWith(n.prefix))
                ?.type ?? '',
        archetype: `"${Class}'${Package}.Default__${Class}'"`,
        staticProperties,
        links: {
            input: defaultProperties.filter(NodeProperty.LINKS_INPUT),
            output: defaultProperties.filter(NodeProperty.LINKS_OUTPUT),
            variable: defaultProperties.filter(NodeProperty.LINKS_VARIABLE),
        },
    }
}

export function nodeToJSON (node: UnrealJsonReadFile): UnrealJsonReadFileNode {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { staticProperties, defaultproperties, links, ...json } = node

    const inputLinks = nodeLinks.node(links.input),
        outputLinks = nodeLinks.node(links.output),
        variableLinks = nodeLinks.variable(links.variable)

    const props = defaultproperties
        .map(prop => {
            const { name, value } = prop

            return NodeProperties.isDefault(name) || !value ? null : prop
        })
        .filter(n => n) as RawUnrealJsonConstant[]

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
            variable: variableLinks,
        },
    }
}

export function destructureDefaultProperty (input: string) {
    return input
        .slice(1, -1)
        .match(/(?<=,|^)(.*?=.*?)(?=,|$)/gm)
        ?.map((i, _, a) => {
            return i.includes('(')
                ? [i, a[_ + 1]]
                      .join(',')
                      .slice(0, [i, a[_ + 1]].join(',').indexOf('),') + 1)
                : i.includes(')')
                ? i.slice(i.indexOf(')') + 2)
                : i
        })
        .filter(n => n)
        .map(n => n.split('=') as [string, string])
}

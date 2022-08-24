import { Constants } from '@kismet.ts/shared'

import type {
    RawUnrealJsonDefaultVariables,
    RawUnrealJsonVariable,
} from '../extractor/files.js'

export function convertNodeName (name: string | null | undefined) {
    return name
        ?.replaceAll('"', '')
        .split(' ')
        .join('')
        .replace('?', '')
        .replace(/\\|\//g, '_')
}

export class NodeProperties {
    private properties: RawUnrealJsonDefaultVariables[]

    constructor (properties: RawUnrealJsonDefaultVariables[]) {
        this.properties = properties
    }

    public get (name: string) {
        return this.properties.find(prop => prop.name === name)?.value ?? ''
    }

    public filter (startString: string) {
        return this.properties
            .filter(prop => prop.name.startsWith(`${startString}(`))
            .map(x => x.value)
    }

    public static isDefault = (name: string): boolean => {
        return (
            name.includes(Constants.NodeProperty.LINKS_INPUT) ||
            name.includes(Constants.NodeProperty.LINKS_OUTPUT) ||
            name.includes(Constants.NodeProperty.LINKS_VARIABLE) ||
            name === Constants.NodeProperty.NAME ||
            name === Constants.NodeProperty.CATEGORY
        )
    }
}

export function getStaticProperties (variables: RawUnrealJsonVariable[]) {
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
                      '}',
                  ]
                : [],
    }

    const staticProperties =
        enums.variables.length > 0
            ? enums.variables.map(c => `    ${c}`).join('\n')
            : ''

    return staticProperties
}

const nodeMatchDescriptions =
    <B extends string = ''>() =>
    <T extends string>(
        links: string[],
        matches: [T, RegExp, string | undefined][]
    ) => {
        return links.map(link =>
            matches.reduce(
                (output, match) => {
                    const value = link.match(match[1])?.[0]

                    return {
                        ...output,
                        [match[0]]:
                            match[2] != undefined ? match[2] === value : value,
                    }
                },
                {} as {
                    [K in T]: K extends B ? boolean : string
                }
            )
        )
    }

export const nodeLinks = {
    node: (links: string[]) =>
        nodeMatchDescriptions()(links, [
            ['name', /(?<=LinkDesc=)(.*?)(?=,)/g, undefined],
        ]),

    variable: (links: string[]) =>
        nodeMatchDescriptions<'isOutput'>()(links, [
            ['name', /(?<=LinkDesc=)(.*?)(?=,)/g, undefined],
            ['expectedType', /(?<=ExpectedType=)(.*?)(?=,)/g, undefined],
            ['isOutput', /(?<=bWriteable=)(.*?)(?=,)/g, 'true'],
        ]),
}

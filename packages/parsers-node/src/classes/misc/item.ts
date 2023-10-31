import { BaseSequenceItem, SequenceItemType } from "@kismet.ts/core";
import { Constants, readArchetype } from "@kismet.ts/shared";

import { RawUnrealJsonDefaultVariables, UnrealJsonReadFile } from "../extractor/index.js";
import { fillClassTemplate } from "../utils/write.js";

export function createDefaultArchetype (options: BaseSequenceItem | { Class: string, Package: string }) {
    const { Class, Package } = 'linkId' in options ? options.ClassData : options

    return `${Class}'${Package}.Default__${Class}'`
}

export interface ClassFileCreateOptions {
    type: Constants.NodeType
    category: string
    defaultproperties: RawUnrealJsonDefaultVariables[]
    placeable?: boolean
}

/**
 * 
 * @param item 
 * @param options 
 */
export function createClassFile (item: BaseSequenceItem, options: ClassFileCreateOptions): string | null {
    const file = createClassFileData(item, options)

    return fillClassTemplate(file)
}

export function createClassFileData (item: SequenceItemType, options?: Partial<ClassFileCreateOptions>): UnrealJsonReadFile {
    const { category, defaultproperties, placeable, type } = options ?? {}
    const { Class, Package } = readArchetype(item.rawData.ObjectArchetype)

    return {
        archetype: item.rawData.ObjectArchetype,
        name: item.rawName,
        Class,
        Package,
        category: category ?? '',
        links: <UnrealJsonReadFile['links']>item.connections.rawInputs,
        type: <Constants.NodeType>(type ?? item.type!),
        staticProperties: '',
        structures: [],
        enums: {},
        placeable: placeable ?? false,
        Extends: 'Object',
        defaultproperties: defaultproperties ?? [],
        variables: []
    }
}
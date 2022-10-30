import { BaseSequenceItem } from "@kismet.ts/core";
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
    const { category, defaultproperties, placeable, type } = options

    const file: UnrealJsonReadFile = {
        archetype: item.rawData.ObjectArchetype,
        name: item.rawName,
        ...readArchetype(item.rawData.ObjectArchetype),
        category,
        links: <UnrealJsonReadFile['links']>item['inputs'],
        type,
        staticProperties: '',
        structures: [],
        enums: {},
        placeable: placeable ?? false,
        Extends: 'Object',
        defaultproperties,
        variables: []
    }

    return fillClassTemplate(file)
}
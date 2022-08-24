import { KismetConnectionType, } from '@kismet.ts/core'
import { Constants, Enum, If } from '@kismet.ts/shared'

import type { BlenderAddonGeneratorOptions } from '../blender/parser.js'

export interface JsonFile extends Record<string, string> {
    name: string
    type: string
    category: string
    Package: string
}

export interface PathInput {
    importPath: string
    exportPath: string
    packages?: string[]
}

export interface ExportOptions<T extends boolean = boolean>
    extends Record<string, unknown> {
    debug?: boolean
    groupItems?: boolean
    json?: boolean
    blender?: T
    blenderOptions?: If<T, BlenderAddonGeneratorOptions> | undefined
    types?: Enum<Exclude<Constants.NodeType, Constants.NodeType.SEQUENCES>>[]
    classes?: boolean
    version?: string | null
    writeIndexFile?: boolean
    //sort?: 'package' | 'name' TODO: implement
}

export type LocalClassesCreateOptions = PathInput & ExportOptions

export interface PathCreateOptions {
    check?: boolean
}

export interface PathReadError {
    code: string
    path: string
    syscall: string
}

export interface RawUnrealJsonConstant {
    name: string
    value: string
}

export type RawUnrealJsonDefaultVariables = RawUnrealJsonConstant

export interface RawUnrealJsonEnum {
    [name: string]: string[]
}

export interface RawUnrealJsonStructure {
    name: string
    properties: RawUnrealJsonVariable[]
}

export interface RawUnrealJsonVariable {
    flags: string
    name: string
    type: string
    replicated: Constants.KismetBoolean
    category: string | null
}

export interface RawUnrealJsonFile extends Record<string, unknown> {
    name: string
    extends: string
    placeable: boolean
    extendswithin: string | 'Object'
    constants: RawUnrealJsonConstant[]
    structs: RawUnrealJsonStructure[]
    enums: RawUnrealJsonEnum
    variables: RawUnrealJsonVariable[]
    defaultproperties: RawUnrealJsonDefaultVariables[]
    defaultobjects?: {
        name: string
        class: string
        properties: RawUnrealJsonDefaultVariables[]
    }
}

export interface UnrealJsonReadFile {
    archetype: string
    Class: string
    Package: string
    Extends: string
    placeable: boolean
    enums: RawUnrealJsonEnum
    structures: RawUnrealJsonStructure[]
    defaultproperties: RawUnrealJsonConstant[]
    links: Record<KismetConnectionType, string[]>
    name: string
    category: string
    staticProperties: string
    type: Constants.NodeType
    variables: RawUnrealJsonVariable[]
}

export type UnrealJsonReadFileNode = Omit<
    UnrealJsonReadFile,
    'links' | 'staticProperties'
> & {
    displayName?: string
    links: Record<
        KismetConnectionType,
        { name: string; expectedType?: string; isOutput?: boolean }[]
    >
}

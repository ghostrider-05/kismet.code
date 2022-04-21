import { KismetBoolean, NodeType } from './enums.js'

import type { Enum, If } from './index.js'
import type { KismetConnectionType } from './connectionLink.js'
import type { BlenderAddonGeneratorOptions } from '../parser/blender/parser.js'

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

interface _ExportOptions<T extends boolean = true>
    extends Record<string, unknown> {
    debug?: boolean
    groupItems?: boolean
    json?: boolean
    blender?: T
    blenderOptions: If<T, BlenderAddonGeneratorOptions> | undefined
    types?: Enum<Exclude<NodeType, NodeType.SEQUENCES>>[]
    classes?: boolean
}

export type ExportOptions<T extends boolean = boolean> = Partial<
    _ExportOptions<T>
>

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
    replicated: KismetBoolean
}

export interface RawUnrealJsonFile extends Record<string, unknown> {
    name: string
    extends: string
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
    defaultproperties: RawUnrealJsonConstant[]
    links: Record<KismetConnectionType, string[]>
    name: string
    category: string
    staticProperties: string
    type: NodeType
    variables: RawUnrealJsonVariable[]
}

export type UnrealJsonReadFileNode = Omit<
    UnrealJsonReadFile,
    'links' | 'staticProperties'
> & {
    displayName?: string
    links: Record<
        KismetConnectionType,
        { name: string; expectedType?: string }[]
    >
}

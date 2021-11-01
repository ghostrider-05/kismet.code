import { KismetBoolean } from './enums.js'

import type { KismetConnectionType } from './connectionLink.js'

export interface RawUnrealJsonConstant {
    name: string
    value: string
}

export type RawUnrealJsonDefaultVariables = RawUnrealJsonConstant

export interface RawUnrealJsonEnum { 
    [name: string]: string[]
}

export interface RawUnrealJsonStructure { 
    name: string, 
    properties: RawUnrealJsonVariable[] 
} 

export interface RawUnrealJsonVariable {
    flags: string
    name: string
    type: string
    replicated: KismetBoolean.True | KismetBoolean.False
}

export interface RawUnrealJsonFile {
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
    defaultproperties: RawUnrealJsonConstant[]
    links: Record<KismetConnectionType, string[]>
    name: string
    category: string
    staticProperties: string
    type: string
    variables: RawUnrealJsonVariable[]
}

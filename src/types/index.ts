import {
    BaseSequenceItem,
    SequenceAction,
    SequenceCondition,
    SequenceEvent,
    SequenceVariable
} from '../structures/Sequence/index.js'

import { NodeType } from './enums.js'

export * from './connectionLink.js'
export * from './options.js'
export * from './parser.js'

export type ArrayUnion<T> = T | T[]

export type Awaitable<T> = Promise<T> | T

export type Enum<T extends string> = T | `${T}`

export type ClassConstructor<T = unknown, U extends unknown[] = []> = new (
    ...args: U
) => T

export interface KismetVectorComponents {
    x: number
    y: number
    z: number
}

export type KismetPosition = Omit<KismetVectorComponents, 'z'>

export type UDKSceneObject = string

export type UDKContentBrowserObject = 'None' | string

export type SchemaItemNames = ArrayUnion<
    Omit<SequenceItemTypeName, 'events' | 'conditions' | 'sequences'>
>

export type SequenceItemType =
    | BaseSequenceItem
    | SequenceAction
    | SequenceCondition
    | SequenceVariable
    | SequenceEvent

export type SequenceItemTypeName = Enum<NodeType>

export type KismetVariablesType = string | number | boolean | null | undefined

export type KismetVariableInternalTypeList = [string, KismetVariablesType][]

import { 
    SequenceAction,
    SequenceCondition,
    SequenceEvent,
    SequenceVariable
} from '../structures/Sequence/index.js'

export * from './connectionLink.js'
export * from './options.js'
export * from './parser.js'

export interface KismetVectorComponents {
    x: number,
    y: number,
    z: number
}

export type UDKSceneObject = string

export type UDKContentBrowserObject = 'None' | string

export type SequenceItemType = SequenceAction | SequenceCondition | SequenceVariable | SequenceEvent

export type SequenceItemTypeName = 'actions' | 'events'

export type KismetVariableInternalType = string | number

export type KismetVariableInternalTypeList = [string, KismetVariableInternalType][]

export type KismetVariablesType = string | number | null | undefined

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

export type SequenceItemTypeName = 'actions' | 'events' | 'conditions' | 'variables'

export type KismetVariablesType = string | number | boolean | null | undefined

export type KismetVariableInternalTypeList = [string, KismetVariablesType][]

import { 
    SequenceAction,
    SequenceEvent,
    SequenceVariable
} from '../structures/Sequence/index.js'

export * from './connectionLink.js'
export * from './parser.js'

export interface projectOptions {
    projectName: string
    layout?: {
        startX?: number
        startY?: number
        spaceBetween?: number
    }
}

export interface BaseKismetItemOptions {
    ObjInstanceVersion?: number
    ObjectArchetype: string
    inputs: {
        input?: string[],
        output?: string[],
        variable?: string[]
    }
    Draw?: {
        width: number
        maxWidth?: number
        height?: number,
        inputOffset: number
    }
}

export interface BaseKismetItemDrawOptions { 
    x: number; 
    y: number; 
    class: string; 
    ObjectArchetype: string; 
    ParentSequence: string; 
    ObjInstanceVersion: number;
    nameId: number;
    DrawConfig: {
        width: number
        maxWidth?: number | null
        height?: number | null
    }
}

export interface KismetObjectCommentOptions {
    comment?: string,
    outputCommentToScreen?: boolean,
    supressAutoComment?: boolean
}

interface BaseKismetEventOptions {
    maxTriggerCount?: number,
    triggerDelay?: number,
    enabled?: boolean,
    playerOnly?: boolean,
    clientSideOnly?: boolean
}

interface BaseKismetVariableOptions {
    name?: string
}

export interface BaseKismetActionOptions {
    next?: SequenceAction
}

export interface KismetVectorComponents {
    x: number,
    y: number,
    z: number
}

export type UDKSceneObject = string

export type UDKContentBrowserObject = 'None' | string

export type SequenceItemType = SequenceAction | SequenceVariable | SequenceEvent

export type SequenceItemTypeName = 'actions' | 'events'

export type KismetVariableInternalType = string | number

export type KismetVariableInternalTypeList = [string, KismetVariableInternalType][]

export type KismetVariablesType = string | number | null | undefined

export type KismetEventOptions<T extends {} = {}> = T & BaseKismetEventOptions

export type KismetVariableOptions<T  extends {} = {}> = T & BaseKismetVariableOptions

export type BaseKismetActionRequiredOptions<T extends {} = {}> = T & BaseKismetActionOptions

export type KismetActionRequiredOptions<T extends {} = {}> = BaseKismetActionRequiredOptions<T> & KismetObjectCommentOptions

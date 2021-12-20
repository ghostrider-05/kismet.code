import { 
    SequenceAction,
    SequenceCondition
} from '../structures/Sequence/index.js'

export interface layoutOptions {
    startX?: number
    startY?: number
    spaceBetween?: number
}

export interface projectOptions {
    projectName: string
    layout?: layoutOptions
}

export interface BaseKismetConnectionOptions {
    Draw: number,
    OverrideDelta: number
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
    classType: string;
    ObjectArchetype: string; 
    ParentSequence: string; 
    ObjInstanceVersion: number;
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
    next?: SequenceAction | SequenceCondition
}

export type KismetEventOptions<T extends {} = {}> = T & BaseKismetEventOptions

export type KismetVariableOptions<T  extends {} = {}> = T & BaseKismetVariableOptions

export type BaseKismetActionRequiredOptions<T extends {} = {}> = T & BaseKismetActionOptions

export type KismetActionRequiredOptions<T extends {} = {}> = BaseKismetActionRequiredOptions<T> & KismetObjectCommentOptions

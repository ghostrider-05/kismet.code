import { 
    KismetConnection,
    SequenceAction,
    SequenceVariable
} from '../structures/Sequence/index.js'

export interface UDKoptions {
    projectName: string
    layout?: {
        startX?: number
        startY?: number
        spaceBetween?: number
    }
}

export interface BaseKismetItemOptions {
    ObjInstanceVersion: number
    ParentSequence: string
    ObjectArchetype: string
    inputs: {
        input?: string[],
        output?: string[],
        variable?: string[]
    }
    Draw: {
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
    Name: string;
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

export type SequenceItemType = SequenceAction | SequenceVariable

export type KismetVariablesType = string | number | null | undefined

export type KismetEventOptions<T extends {} = {}> = T & BaseKismetEventOptions

export type KismetVariableOptions<T  extends {} = {}> = T & BaseKismetVariableOptions

export type BaseKismetActionRequiredOptions<T extends {} = {}> = T & BaseKismetActionOptions

export type KismetActionRequiredOptions<T extends {} = {}> = BaseKismetActionRequiredOptions<T> & KismetObjectCommentOptions

// Kismet connection links

type KismetVariableLinkConnection = string

export type KismetConnectionType = 'input' | 'variable' | 'output'

// Cannot convert to interface
export type KismetConnections = {
    input: KismetConnection[],
    output: KismetConnection[],
    variable: KismetConnection[]
}

export interface BaseKismetVariableLink {
    name: string
    OverrideDelta: number;
    bClampedMin: boolean;
    bClampedMax: boolean;
    bMoving: boolean;
    bHidden: boolean;
}

export interface BaseKismetConnectionLink extends BaseKismetVariableLink {
    bHasImpulse: boolean;
    bDisabled: boolean;
    bDisabledPIE: boolean;
    ActivateDelay: number;
    LinkedOp: null;
    DrawY: number;
}

export interface KismetConnectionLink extends BaseKismetConnectionLink {
    setActivateDelay (duration: number): KismetConnectionLink
}

export interface KismetVariableLink extends BaseKismetVariableLink {
    expectedType: string;
    PropertyName: string;
    bAllowAnyType: boolean;
    CachedProperty: null;
    MinVars: number;
    MaxVars: number;
    DrawX: number;
    bWriteable: boolean;
    bSequenceNeverReadsOnlyWritesToThisVar: boolean;
    bModifiesLinkedObject: boolean;
    links: KismetVariableLinkConnection[];
}

export interface KismetInputLink extends KismetConnectionLink {
    QueuedActivations: number;
}

export interface KismetOutputLink extends KismetConnectionLink {
    bIsActivated: boolean;
    PIEActivationTime: number;
    links: KismetVariableLinkConnection[];
}
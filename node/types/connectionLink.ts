import { 
    KismetConnection
} from '../structures/index.js'

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
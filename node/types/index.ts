import { SequenceAction } from '../structures/Sequence/index.js'

export interface UDKoptions {
    projectName: string
    layout?: {
        startX?: number
        startY?: number
        spaceBetween?: number
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

export type KismetEventOptions<T extends {} = {}> = T & BaseKismetEventOptions

export type KismetVariableOptions<T  extends {} = {}> = T & BaseKismetVariableOptions

export type BaseKismetActionRequiredOptions<T extends {} = {}> = T & BaseKismetActionOptions

export type KismetActionRequiredOptions<T extends {} = {}> = BaseKismetActionRequiredOptions<T> & KismetObjectCommentOptions
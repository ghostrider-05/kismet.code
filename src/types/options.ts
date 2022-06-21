import {
    ProcessId,
    SequenceAction,
    SequenceCondition,
} from '../structures/index.js'

import { PositionStyleOption, VariablePositionStyleOption } from './enums.js'

/**
 * Options for layouts
 *
 * - none: set no position
 * - grid: place all nodes in a grid. To have custom control over the grid placements, use Item#setPosition
 * - waterfall: place the next object in the sequence right and below the current object
 * - mountain: place the next object in the sequence right and above the current object
 * - schema: apply the options in the given schema
 *
 * @default 'none'
 */
export type PositionStyleOptions = PositionStyleOption

/**
 * Position options for variables
 *
 * - inherit: set default positions
 * - global: set all variables in global box
 * - attach: place variables close to the first connected item
 * - schema: apply the options in the given schema
 *
 * @default 'inherit'
 */
export type VariablePositionStyleOptions = VariablePositionStyleOption

export interface layoutOptions {
    startX?: number
    startY?: number
    spaceBetween?: number
}

/**
 * Options for creating a new kismet sequence for a project
 *
 * @param projectName - The name of the project
 * @param layout - Default position options for sequences in the project
 */
export interface projectOptions<S> {
    projectName: string
    debug?: boolean
    layout?: SequencePositionOptions<S>
}

export interface SequenceSchemaVariableOptions {
    style: Omit<VariablePositionStyleOptions, 'schema' | 'none'>
    itemClass?: string
    globalOptions?: {
        bounds: [number, number, number, number]
    }
}

export interface SequenceSchemaOptions<T> {
    event?: {
        id: string
        connectionName?: string
    }
    layout: {
        type?: T
        style: Omit<PositionStyleOptions, 'schema' | 'none'>
        variables?: SequenceSchemaVariableOptions[]
        options: Required<layoutOptions>
    }[]
}

export interface SequencePositionManagerOptions<S> {
    layoutOptions: Required<layoutOptions>
    projectId?: ProcessId
    style?: PositionStyleOptions
    schema?: SequenceSchemaOptions<S>[]
}

export type SequencePositionOptions<S> = Omit<
    SequencePositionManagerOptions<S>,
    'layoutOptions'
> & {
    position?: Required<layoutOptions>
}

export interface SequenceViewOptions {
    x?: number
    y?: number
    zoom?: number
}

export interface SequenceBaseConstructorOptions<S> {
    layout?: SequencePositionOptions<S>
    name?: string
    mainSequence?: boolean
    project?: ProcessId
    defaultView?: Required<SequenceViewOptions>
}

export type SequenceOptions<T, S> = Omit<
    SequenceBaseConstructorOptions<S>,
    'mainSequence'
> & {
    objects?: T[]
    name: string
}

export interface BaseKismetConnectionOptions {
    Draw: number
    OverrideDelta: number
}

export interface BaseKismetItemOptions {
    /**
     * The version of the node
     */
    ObjInstanceVersion?: number
    /**
     * The archetype of the node. This holds the definition, including the package and class.
     */
    ObjectArchetype: string
    /**
     * The display name of the node
     */
    name?: string
    /**
     * The sequence index for this node. The reference to this node will be {Class}_{index}.
     * If not specified, a new and available index will be chosen
     */
    index?: number
    /**
     * The connections defined on this node
     */
    inputs: {
        input?: string[]
        output?: string[]
        variable?: string[]
    }
    /**
     * Specify a start position for this node
     */
    position?: { x?: number; y?: number }
    /**
     * The name of the sequence, if the sequence is not the main sequence
     */
    sequence?: string
    /** @deprecated */
    Draw?: {
        width: number
        maxWidth?: number
        height?: number
        inputOffset: number
    }
}

export interface BaseKismetItemDrawOptions {
    x: number
    y: number
    class: string
    classType: string
    ObjectArchetype: string
    ParentSequence: string
    ObjInstanceVersion: number
    DrawConfig: {
        width: number
        maxWidth?: number | null
        height?: number | null
    }
}

export interface KismetObjectCommentOptions {
    comment?: string
    outputCommentToScreen?: boolean
    supressAutoComment?: boolean
}

export interface BaseKismetEventOptions {
    maxTriggerCount?: number
    triggerDelay?: number
    enabled?: boolean
    playerOnly?: boolean
    clientSideOnly?: boolean
}

export interface BaseKismetVariableOptions {
    name?: string
}

export interface BaseKismetActionOptions {
    next?: SequenceAction | SequenceCondition
}

export type KismetEventOptions<T extends {} = {}> = T & BaseKismetEventOptions

export type KismetVariableOptions<T extends {} = {}> = T &
    BaseKismetVariableOptions

export type BaseKismetActionRequiredOptions<T extends {} = {}> = T &
    BaseKismetActionOptions

export type KismetActionRequiredOptions<T extends {} = {}> =
    BaseKismetActionRequiredOptions<T> & KismetObjectCommentOptions

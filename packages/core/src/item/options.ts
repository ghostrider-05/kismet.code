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
     * The category name of the node
     */
    category?: string
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
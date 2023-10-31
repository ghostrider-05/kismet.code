import { indent } from '../util/util.js'
import { KismetBoolean, NodeType } from './Constants.js'

export type KismetFormatterInput = string | number | boolean | null | undefined

/**
 * Util class for formatting a kismet item
 */
export class KismetItemFormatter {
    /**
     * The character to use for joining the variables when formatting
     * @default \n
     */
    public static joinCharacter = '\n'

    /**
     * Format the first line of the kismet item
     * @param name The name of the item, ends with the sequence number
     * @param Class The class of the item, specified in the archetype of the item
     */
    public static firstLine (name: string, Class: string): string {
        return `Begin Object Class=${Class} Name=${name}`
    }

    /**
     * Format the last line of the kismet item
     */
    public static lastLine (): string {
        return 'End Object'
    }

    /**
     * Format a variable in the kismet item
     * @param name 
     * @param value 
     * @returns The variable in the format: `{name}={value}`
     */
    public static variable<Defined extends boolean = false> (
        name: string,
        value: KismetFormatterInput
    ): Defined extends true ? string : string | undefined {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore Return type
        if (value == undefined || value == null || name.length === 0) return

        if (typeof value === 'boolean') {
            value = <KismetFormatterInput>(value ? KismetBoolean.True : KismetBoolean.False)
        }

        return `${indent()}${name.trimEnd()}=${value}`
    }

    /**
     * Format the whole kismet item
     * @param name
     * @param Class 
     * @param variables The formatted variables
     */
    public static format (name: string, Class: string, variables: (string | [string, KismetFormatterInput])[]): string {
        return [
            KismetItemFormatter.firstLine(name, Class),
            ...variables
                .map(variable => {
                    return typeof variable !== 'string' ? KismetItemFormatter.variable(...variable) : variable
                })
                .filter(variable => variable != undefined),
            KismetItemFormatter.lastLine()
        ].join(KismetItemFormatter.joinCharacter)
    }
}

export function convertVariablesRecordToArray <
    T = undefined
> (variables: Record<string, T>): [string, T][] {
    return Object.keys(variables).map(key => {
        return [key, variables[key]]
    })
}

/**
 * Get the node type for a given item class
 * @param Class The input class of the item
 * @returns The node type. Sequences are not included
 */
export function getNodeType (Class: string): NodeType | undefined {
    const prefixes: { prefix: string, type: NodeType }[] = [
        {
            prefix: 'SeqAct_',
            type: NodeType.ACTIONS,
        },
        {
            prefix: 'SeqCond_',
            type: NodeType.CONDITIONS,
        },
        {
            prefix: 'SeqEvent_',
            type: NodeType.EVENTS,
        },
        {
            prefix: 'SeqVar_',
            type: NodeType.VARIABLES,
        },
    ]

    return prefixes.find(({ prefix }) => Class.startsWith(prefix))?.type
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
class A { constructor (...args: any[]) {
    /** */
}}

/**
 * @beta
 */
export function constructItem <R extends A, T extends typeof A> (item: T): R {
    return new item() as R
}

/**
 * Get the class, class type and package name from an archetype
 * @param archetype The archetype of the item
 */
export function readArchetype (
    archetype: string
): Record<'Class' | 'ClassType' | 'Package', string> {
    const [Class, defaultClass] = archetype.split("'")
    const [Package] = defaultClass.split('.')

    return {
        Class,
        ClassType: `Class'${Package}.${Class}'`,
        Package,
    }
}
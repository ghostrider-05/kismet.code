import { NodeType } from './Constants.js'

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
    public static variable (name: string, value: string | number | undefined): string | undefined {
        if (value == undefined) return

        return `${name}=${value}`
    }

    /**
     * Format the whole kismet item
     * @param name
     * @param Class 
     * @param variables The formatted 
     */
    public static format (name: string, Class: string, variables: (string | [string, string | number | undefined])[]): string {
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

/**
 * Get the class and package name from an archetype
 * @param archetype The archetype of the item
 */
export function readArchetype (
    archetype: string
): Record<'Class' | 'Package', string> {
    const [Class, defaultClass] = archetype.split("'")
    const [Package] = defaultClass.split('.')

    return {
        Class,
        Package,
    }
}
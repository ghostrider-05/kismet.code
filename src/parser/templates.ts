import type { KismetConnectionType, UnrealJsonReadFile } from '../types'

const formatLinks = (links: Record<KismetConnectionType, string[]>): string => {
    const formatted = JSON.stringify(links, null, 4)
        .split('\n')
        .map((n, i) => (i > 0 ? `\t\t\t${n}` : n))
        .join('\n')

    return formatted
}

export const actions = (node: UnrealJsonReadFile): string => `
/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";

export class ${node.name} extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: ${node.archetype},
            inputs: ${formatLinks(node.links)}
        })
    }
${node.staticProperties}
}`

export const conditions = (node: UnrealJsonReadFile): string => `
/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceCondition } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
                
export class ${node.name} extends SequenceCondition {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
                ObjectArchetype: ${node.archetype},
                inputs: ${formatLinks(node.links)}
            })
        }
        ${node.staticProperties}
}`

export const events = (node: UnrealJsonReadFile): string => `
/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceEvent } from "../../../structures/Sequence/index.js";
import { KismetEventOptions } from "../../../types/index.js";

export class ${node.name} extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: ${node.archetype},
            inputs: ${formatLinks(node.links)},
            ...options
        })
    }
}
`

export const variables = (node: UnrealJsonReadFile): string => `
/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceVariable } from "../../../structures/Sequence/index.js";
import { KismetVariableOptions, BaseKismetItemOptions } from "../../../types/index.js";

export class ${node.name} extends SequenceVariable {
    constructor (options?: KismetVariableOptions & BaseKismetItemOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: ${node.archetype},
            inputs: {},
            ...options
        })
    }
}
`

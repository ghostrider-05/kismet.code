import type { KismetConnectionType } from '@kismet.ts/core'

import type { UnrealJsonReadFile } from './files.js'

const formatLinks = (links: Record<KismetConnectionType, string[]>): string => {
    const formatted = JSON.stringify(links, null, 4)
        .split('\n')
        .map((n, i) => (i > 0 ? `${'    '.repeat(3)}${n}` : n))
        .join('\n')

    return formatted
}

const formatStatic = (node: UnrealJsonReadFile): string => {
    return node.staticProperties.replace(/\t/g, '    ')
}

export const actions = (node: UnrealJsonReadFile, version?: number): string => `
import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";

export class ${node.name} extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: ${version},
            ObjectArchetype: ${node.archetype},
            inputs: ${formatLinks(node.links)}
        })
    }
${formatStatic(node)}
}`

export const conditions = (node: UnrealJsonReadFile, version?: number): string => `
import { SequenceCondition, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
                
export class ${node.name} extends SequenceCondition {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
                ...options,
                ObjInstanceVersion: ${version},
                ObjectArchetype: ${node.archetype},
                inputs: ${formatLinks(node.links)}
            })
        }
${formatStatic(node)}
}`

export const events = (node: UnrealJsonReadFile, version = 3): string => `
import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";

export class ${node.name} extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: ${version},
            ObjectArchetype: ${node.archetype},
            inputs: ${formatLinks(node.links)},
            ...options
        })
    }
}`

export const variables = (node: UnrealJsonReadFile, version?: number): string => `
import { SequenceVariable, KismetVariableOptions, BaseKismetItemOptions } from "@kismet.ts/core";

export class ${node.name} extends SequenceVariable {
    constructor (options?: KismetVariableOptions & BaseKismetItemOptions) {
        super({
            ObjInstanceVersion: ${version},
            ObjectArchetype: ${node.archetype},
            inputs: {},
            ...options
        })
    }
}`

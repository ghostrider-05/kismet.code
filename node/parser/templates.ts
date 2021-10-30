import type { UnrealJsonReadFile } from "../types";

export const actions = (node: UnrealJsonReadFile): string => `
import { SequenceAction } from "../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../types/index.js";

export class ${node.name} extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: ${node.archetype},
            inputs: ${JSON.stringify(node.links, null, 4)}
        })
    }
${node.staticProperties ?? ''}
}
                `
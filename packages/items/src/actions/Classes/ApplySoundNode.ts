/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class ApplySoundNode extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_ApplySoundNode'Engine.Default__SeqAct_ApplySoundNode'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	PlaySound:'PlaySound',
		ApplyNode:'ApplyNode'
    }
}
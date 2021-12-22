/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class NonNativeUpdate extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_NonNativeUpdate_X'ProjectX.Default__SeqAct_NonNativeUpdate_X'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
}
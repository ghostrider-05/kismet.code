/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class DemoCar extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_DemoCar_TA'TAGame.Default__SeqAct_DemoCar_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
}
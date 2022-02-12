/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class SetApexClothingParameter extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetApexClothingParam'Engine.Default__SeqAct_SetApexClothingParam'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	bEnableApexClothingSimulation:'bEnableApexClothingSimulation'
    }
}
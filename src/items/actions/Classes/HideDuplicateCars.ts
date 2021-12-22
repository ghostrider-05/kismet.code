/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class HideDuplicateCars extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_HideDuplicateCar_TA'TAGame.Default__SeqAct_HideDuplicateCar_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	ActorNameToHide:'ActorNameToHide',
		bKeepAllInstancesHidden:'bKeepAllInstancesHidden',
		bFoundDemoedCar:'bFoundDemoedCar'
    }
}
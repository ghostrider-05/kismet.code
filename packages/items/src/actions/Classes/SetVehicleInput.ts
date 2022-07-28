/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class SetVehicleInput extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetVehicleInput_TA'TAGame.Default__SeqAct_SetVehicleInput_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	Input:'Input'
    }
}
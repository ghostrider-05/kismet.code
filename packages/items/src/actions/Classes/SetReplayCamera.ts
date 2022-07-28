/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class SetReplayCamera extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetReplayCamera_TA'TAGame.Default__SeqAct_SetReplayCamera_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	FocusActor:'FocusActor',
		LocationOffset:'LocationOffset',
		Rotation:'Rotation',
		FOV:'FOV'
    }
}
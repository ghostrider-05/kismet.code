/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class CarMatinee extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_CarMatinee_TA'TAGame.Default__SeqAct_CarMatinee_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	CinematicCarArchPath:'CinematicCarArchPath',
		bHideAfterPause:'bHideAfterPause',
		bHideAfterCompleted:'bHideAfterCompleted',
		ClassesToNotShow:'ClassesToNotShow'
    }
}
/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class SetTimeDilation extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetTimeDilation_TA'TAGame.Default__SeqAct_SetTimeDilation_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	VfTable_FTickableObject:'VfTable_FTickableObject',
		bUseCurve:'bUseCurve',
		bActivated:'bActivated',
		CurrentTime:'CurrentTime',
		EndTime:'EndTime',
		SlomoValue:'SlomoValue',
		SlomoCurve:'SlomoCurve'
    }
}
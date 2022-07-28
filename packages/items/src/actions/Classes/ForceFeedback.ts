/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class ForceFeedback extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_ForceFeedback'Engine.Default__SeqAct_ForceFeedback'",
            inputs: {
			    "input": [
			        "(LinkDesc=\"Start\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
			        "(LinkDesc=\"Stop\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	FFWaveform:'FFWaveform',
		PredefinedWaveForm:'PredefinedWaveForm'
    }
}
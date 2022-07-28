/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class AkPostTrigger extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_AkPostTrigger'AkAudio.Default__SeqAct_AkPostTrigger'",
            inputs: {
			    "input": [
			        "(LinkDesc=\"Post\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	Trigger:'Trigger'
    }
}
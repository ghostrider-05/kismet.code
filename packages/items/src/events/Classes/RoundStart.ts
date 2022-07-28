/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceEvent } from "../../../structures/Sequence/index.js";
import { KismetEventOptions } from "../../../types/index.js";
export class RoundStart extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_RoundStart_TA'TAGame.Default__SeqEvent_RoundStart_TA'",
            inputs: {
			    "input": [],
			    "output": [
			        "(Links=none,LinkDesc=\"Start Round\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
			    ],
			    "variable": []
			},
            ...options
        })
    }
}
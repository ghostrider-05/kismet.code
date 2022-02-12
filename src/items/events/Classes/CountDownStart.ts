/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceEvent } from "../../../structures/Sequence/index.js";
import { KismetEventOptions } from "../../../types/index.js";
export class CountDownStart extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_CountDownStart_TA'TAGame.Default__SeqEvent_CountDownStart_TA'",
            inputs: {
			    "input": [],
			    "output": [
			        "(Links=none,LinkDesc=\"Start CountDown\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
			    ],
			    "variable": []
			},
            ...options
        })
    }
}
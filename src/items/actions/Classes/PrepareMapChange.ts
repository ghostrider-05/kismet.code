/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class PrepareMapChange extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_PrepareMapChange'Engine.Default__SeqAct_PrepareMapChange'",
            inputs: {
			    "input": [
			        "(LinkDesc=\"PrepareLoad\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ],
			    "output": [
			        "(Links=none,LinkDesc=\"Finished\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
			    ],
			    "variable": []
			}
        })
    }
    static Variables = {
    	MainLevelName:'MainLevelName',
		InitiallyLoadedSecondaryLevelNames:'InitiallyLoadedSecondaryLevelNames',
		bIsHighPriority:'bIsHighPriority',
		bStatusIsOk:'bStatusIsOk'
    }
}
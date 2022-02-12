/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class AddRemoveFaceFXAnimSet extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_AddRemoveFaceFXAnimSet'Engine.Default__SeqAct_AddRemoveFaceFXAnimSet'",
            inputs: {
			    "input": [
			        "(LinkDesc=\"Add FaceFXAnimSets\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
			        "(LinkDesc=\"Remove FaceFXAnimSets\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	FaceFXAnimSets:'FaceFXAnimSets'
    }
}
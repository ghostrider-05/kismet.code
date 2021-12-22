/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceCondition } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class SeqCond_SwitchBase extends SequenceCondition {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
                ObjectArchetype: "SeqCond_SwitchBase'Engine.Default__SeqCond_SwitchBase'",
                inputs: {
			    "input": [],
			    "output": [
			        "(Links=none,LinkDesc=\"Default\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
			    ],
			    "variable": []
			}
            })
        }
}
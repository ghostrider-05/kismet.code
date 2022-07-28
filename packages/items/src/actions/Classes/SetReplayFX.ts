/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class SetReplayFX extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetReplayFX_TA'TAGame.Default__SeqAct_SetReplayFX_TA'",
            inputs: {
			    "input": [
			        "(LinkDesc=\"On\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
			        "(LinkDesc=\"Off\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	FocusDistance:'FocusDistance',
		FocusBlur:'FocusBlur',
		FocusStrength:'FocusStrength',
		bUseGreenScreen:'bUseGreenScreen',
		bUseVignetteOverlay:'bUseVignetteOverlay',
		GreenScreenColor:'GreenScreenColor',
		ImageFilterIndex:'ImageFilterIndex',
		ImageFilterIntensity:'ImageFilterIntensity',
		Vignette:'Vignette'
    }
}
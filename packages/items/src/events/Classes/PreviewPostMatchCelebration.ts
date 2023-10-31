import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class PreviewPostMatchCelebration extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_PreviewPostMatchCelebration_TA'TAGame.Default__SeqEvent_PreviewPostMatchCelebration_TA'",
            inputs: {
                "input": [],
                "output": [
                    "(LinkDesc=\"Start\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)",
                    "(LinkDesc=\"Stop\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            },
            ...options
        })
    }
}
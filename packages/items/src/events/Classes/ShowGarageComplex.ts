import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class ShowGarageComplex extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_ShowGarageComplex_TA'TAGame.Default__SeqEvent_ShowGarageComplex_TA'",
            inputs: {
                "input": [],
                "output": [
                    "(Links=none,LinkDesc=\"Hide\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)",
                    "(Links=none,LinkDesc=\"Show\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            },
            ...options
        })
    }
}
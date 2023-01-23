import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class MainMenuSwitched extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_MainMenuSwitched_TA'TAGame.Default__SeqEvent_MainMenuSwitched_TA'",
            inputs: {
                "input": [],
                "output": [
                    "(Links=none,LinkDesc=\"Changed\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            },
            ...options
        })
    }
}
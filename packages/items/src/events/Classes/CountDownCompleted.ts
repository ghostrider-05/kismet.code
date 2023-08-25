import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class CountDownCompleted extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_CountDownCompleted_TA'TAGame.Default__SeqEvent_CountDownCompleted_TA'",
            inputs: {
                "input": [],
                "output": [
                    "(LinkDesc=\"End CountDown\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            },
            ...options
        })
    }
}
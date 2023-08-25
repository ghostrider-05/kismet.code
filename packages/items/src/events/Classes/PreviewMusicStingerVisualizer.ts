import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class PreviewMusicStingerVisualizer extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_PreviewMusicStingerVisualizer_TA'TAGame.Default__SeqEvent_PreviewMusicStingerVisualizer_TA'",
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
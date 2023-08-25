import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class AkPostTrigger extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_AkPostTrigger'AkAudio.Default__SeqAct_AkPostTrigger'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Post\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=None,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        Trigger:'Trigger'
    }
}
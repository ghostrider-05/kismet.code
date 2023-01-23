import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetSoundMode extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetSoundMode'Engine.Default__SeqAct_SetSoundMode'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Start\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Stop\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        SoundMode:'SoundMode',
        bTopPriority:'bTopPriority'
    }
}
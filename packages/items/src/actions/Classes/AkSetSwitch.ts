import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class AkSetSwitch extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_AkSetSwitch'AkAudio.Default__SeqAct_AkSetSwitch'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Set\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=None,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        SwitchGroup:'SwitchGroup',
        Switch:'Switch'
    }
}
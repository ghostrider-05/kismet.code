import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ForceGarbageCollection extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_ForceGarbageCollection'Engine.Default__SeqAct_ForceGarbageCollection'",
            inputs: {
                "input": [],
                "output": [
                    "(LinkDesc=\"Finished\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            }
        })
    }
}
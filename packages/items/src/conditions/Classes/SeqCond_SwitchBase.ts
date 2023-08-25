import { SequenceCondition, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SeqCond_SwitchBase extends SequenceCondition {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
                ...options,
                ObjInstanceVersion: undefined,
                ObjectArchetype: "SeqCond_SwitchBase'Engine.Default__SeqCond_SwitchBase'",
                inputs: {
                "input": [],
                "output": [
                    "(LinkDesc=\"Default\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            }
            })
        }
}
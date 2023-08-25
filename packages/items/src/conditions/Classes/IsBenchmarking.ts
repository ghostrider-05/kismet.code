import { SequenceCondition, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class IsBenchmarking extends SequenceCondition {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
                ...options,
                ObjInstanceVersion: undefined,
                ObjectArchetype: "SeqCond_IsBenchmarking'Engine.Default__SeqCond_IsBenchmarking'",
                inputs: {
                "input": [],
                "output": [
                    "(LinkDesc=\"Yes\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)",
                    "(LinkDesc=\"No\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            }
            })
        }
}
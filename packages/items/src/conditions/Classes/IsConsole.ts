import { SequenceCondition, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class IsConsole extends SequenceCondition {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
                ...options,
                ObjInstanceVersion: undefined,
                ObjectArchetype: "SeqCond_IsConsole'Engine.Default__SeqCond_IsConsole'",
                inputs: {
                "input": [],
                "output": [
                    "(LinkDesc=\"True\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)",
                    "(LinkDesc=\"False\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            }
            })
        }
}
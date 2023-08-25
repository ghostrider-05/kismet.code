import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ToggleConstraintDrive extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_ToggleConstraintDrive'Engine.Default__SeqAct_ToggleConstraintDrive'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Enable Drive\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=None,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Disable All Drive\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=None,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        bEnableAngularPositionDrive:'bEnableAngularPositionDrive',
        bEnableAngularVelocityDrive:'bEnableAngularVelocityDrive',
        bEnableLinearPositionDrive:'bEnableLinearPositionDrive',
        bEnableLinearvelocityDrive:'bEnableLinearvelocityDrive'
    }
}
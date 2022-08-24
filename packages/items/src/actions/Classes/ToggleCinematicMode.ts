import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ToggleCinematicMode extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_ToggleCinematicMode'Engine.Default__SeqAct_ToggleCinematicMode'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Enable\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Disable\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Toggle\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        bDisableMovement:'bDisableMovement',
        bDisableTurning:'bDisableTurning',
        bHidePlayer:'bHidePlayer',
        bDisableInput:'bDisableInput',
        bHideHUD:'bHideHUD',
        bDeadBodies:'bDeadBodies',
        bDroppedPickups:'bDroppedPickups'
    }
}
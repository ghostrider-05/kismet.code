import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class CheckRotationAngle extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_CheckRotationAngle_TA'TAGame.Default__SeqAct_CheckRotationAngle_TA'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Check\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=None,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [
                    "(LinkDesc=\"Completed\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)",
                    "(LinkDesc=\"Aborted\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkDesc=\"Actor To Check\",LinkVar=None,PropertyName=Actor,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=None,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        Actor:'Actor',
        CheckActor:'CheckActor',
        RotationAngle:'RotationAngle',
        LastRotation:'LastRotation',
        LastDirection:'LastDirection',
        CheckAxis:'CheckAxis',
        TurnAxis:'TurnAxis',
        MaxRotationAngle:'MaxRotationAngle',
        bResetOnDirectionChange:'bResetOnDirectionChange',
        AxisDirection:'AxisDirection'
    }
}
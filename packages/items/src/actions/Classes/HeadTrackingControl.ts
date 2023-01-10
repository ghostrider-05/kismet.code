import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class HeadTrackingControl extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_HeadTrackingControl'Engine.Default__SeqAct_HeadTrackingControl'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Enable\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Disable\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [
                    "(Links=none,LinkDesc=\"Enabled\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)",
                    "(Links=none,LinkDesc=\"Disabled\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": []
            }
        })
    }
    static Variables = {
        TrackControllerName:'TrackControllerName',
        LookAtActorRadius:'LookAtActorRadius',
        bDisableBeyondLimit:'bDisableBeyondLimit',
        bLookAtPawns:'bLookAtPawns',
        MaxLookAtTime:'MaxLookAtTime',
        MinLookAtTime:'MinLookAtTime',
        MaxInterestTime:'MaxInterestTime',
        ActorClassesToLookAt:'ActorClassesToLookAt',
        TargetBoneNames:'TargetBoneNames',
        LookAtTargets:'LookAtTargets',
        ActorToComponentMap:'ActorToComponentMap'
    }
}
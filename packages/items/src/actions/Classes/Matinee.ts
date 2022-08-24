import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class Matinee extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_Interp'Engine.Default__SeqAct_Interp'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Play\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Reverse\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Stop\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Pause\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Change Dir\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [
                    "(Links=none,LinkDesc=\"Completed\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)",
                    "(Links=none,LinkDesc=\"Reversed\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": [
                    "(ExpectedType=class'InterpData',LinkedVariables=none,LinkDesc=\"Data\",LinkVar=None,PropertyName=None,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=1,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        SavedActorTransforms:'SavedActorTransforms',
        SavedActorVisibilities:'SavedActorVisibilities',
        PlayRate:'PlayRate',
        Position:'Position',
        ForceStartPosition:'ForceStartPosition',
        bIsPlaying:'bIsPlaying',
        bPaused:'bPaused',
        bIsBeingEdited:'bIsBeingEdited',
        bLooping:'bLooping',
        bRewindOnPlay:'bRewindOnPlay',
        bNoResetOnRewind:'bNoResetOnRewind',
        bRewindIfAlreadyPlaying:'bRewindIfAlreadyPlaying',
        bReversePlayback:'bReversePlayback',
        bInterpForPathBuilding:'bInterpForPathBuilding',
        bForceStartPos:'bForceStartPos',
        bDisableRadioFilter:'bDisableRadioFilter',
        bClientSideOnly:'bClientSideOnly',
        bSkipUpdateIfNotVisible:'bSkipUpdateIfNotVisible',
        bIsSkippable:'bIsSkippable',
        bShouldShowGore:'bShouldShowGore',
        LinkedCover:'LinkedCover',
        InterpData:'InterpData',
        GroupInst:'GroupInst',
        ReplicatedActorClass:'ReplicatedActorClass',
        ReplicatedActor:'ReplicatedActor',
        PreferredSplitScreenNum:'PreferredSplitScreenNum',
        CameraCuts:'CameraCuts',
        TerminationTime:'TerminationTime',
        RenderingOverrides:'RenderingOverrides',
        ConstantCameraAnim:'ConstantCameraAnim',
        ConstantCameraAnimRate:'ConstantCameraAnimRate'
    }
}
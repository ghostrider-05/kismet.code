import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class PlayCameraAnim extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_PlayCameraAnim'Engine.Default__SeqAct_PlayCameraAnim'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Play\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Stop\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        CameraAnim:'CameraAnim',
        bLoop:'bLoop',
        bRandomStartTime:'bRandomStartTime',
        BlendInTime:'BlendInTime',
        BlendOutTime:'BlendOutTime',
        Rate:'Rate',
        IntensityScale:'IntensityScale',
        PlaySpace:'PlaySpace',
        UserDefinedSpaceActor:'UserDefinedSpaceActor'
    }
}
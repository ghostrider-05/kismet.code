import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class DepthOfField extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetDOFParams'Engine.Default__SeqAct_SetDOFParams'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Enable\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=None,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(LinkDesc=\"Disable\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=None,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        FalloffExponent:'FalloffExponent',
        BlurKernelSize:'BlurKernelSize',
        MaxNearBlurAmount:'MaxNearBlurAmount',
        MinBlurAmount:'MinBlurAmount',
        MaxFarBlurAmount:'MaxFarBlurAmount',
        FocusInnerRadius:'FocusInnerRadius',
        FocusDistance:'FocusDistance',
        FocusPosition:'FocusPosition',
        InterpolateSeconds:'InterpolateSeconds',
        InterpolateElapsed:'InterpolateElapsed',
        OldFalloffExponent:'OldFalloffExponent',
        OldBlurKernelSize:'OldBlurKernelSize',
        OldMaxNearBlurAmount:'OldMaxNearBlurAmount',
        OldMinBlurAmount:'OldMinBlurAmount',
        OldMaxFarBlurAmount:'OldMaxFarBlurAmount',
        OldFocusInnerRadius:'OldFocusInnerRadius',
        OldFocusDistance:'OldFocusDistance',
        OldFocusPosition:'OldFocusPosition'
    }
}
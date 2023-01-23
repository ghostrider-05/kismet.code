import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetActiveAnimChild extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetActiveAnimChild'Engine.Default__SeqAct_SetActiveAnimChild'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Activate\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        NodeName:'NodeName',
        ChildIndex:'ChildIndex',
        BlendTime:'BlendTime'
    }
}
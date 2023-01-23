import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class CommitMapChange extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_CommitMapChange'Engine.Default__SeqAct_CommitMapChange'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Commit\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": []
            }
        })
    }
}
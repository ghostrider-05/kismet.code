import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class CreateAttachComponent extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_CreateAttachComponent_TA'TAGame.Default__SeqAct_CreateAttachComponent_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"AttachTo\",LinkVar=None,PropertyName=AttachTo,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        AttachTo:'AttachTo',
        AttachingComponent:'AttachingComponent'
    }
}
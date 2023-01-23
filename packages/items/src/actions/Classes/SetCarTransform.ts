import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetCarTransform extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetCarTransform_TA'TAGame.Default__SeqAct_SetCarTransform_TA'",
            inputs: {
                "input": [
                    "(LinkDesc=\"Set\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"Instigator\",LinkVar=None,PropertyName=Instigator,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"Transform\",LinkVar=None,PropertyName=Transform,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=1,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        Instigator:'Instigator',
        Transform:'Transform'
    }
}
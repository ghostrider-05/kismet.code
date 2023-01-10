import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class TerminateRBPhysics extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_TermPhys_TA'TAGame.Default__SeqAct_TermPhys_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"RB Actor\",LinkVar=None,PropertyName=RBObj,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        RBObj:'RBObj'
    }
}
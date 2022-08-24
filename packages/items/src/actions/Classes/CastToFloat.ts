import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class CastToFloat extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_CastToFloat'Engine.Default__SeqAct_CastToFloat'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_Int',LinkedVariables=none,LinkDesc=\"Int\",LinkVar=None,PropertyName=Value,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=class'SeqVar_Float',LinkedVariables=none,LinkDesc=\"Result\",LinkVar=None,PropertyName=FloatResult,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        Value:'Value',
        FloatResult:'FloatResult'
    }
}
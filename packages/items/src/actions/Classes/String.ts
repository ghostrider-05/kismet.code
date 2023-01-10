import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class String extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetString'Engine.Default__SeqAct_SetString'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_String',LinkedVariables=none,LinkDesc=\"Value\",LinkVar=None,PropertyName=Value,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=class'SeqVar_String',LinkedVariables=none,LinkDesc=\"Target\",LinkVar=None,PropertyName=Target,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        Target:'Target',
        Value:'Value'
    }
}
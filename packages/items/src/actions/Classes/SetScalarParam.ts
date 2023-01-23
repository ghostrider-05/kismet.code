import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetScalarParam extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetMatInstScalarParam'Engine.Default__SeqAct_SetMatInstScalarParam'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_Float',LinkedVariables=none,LinkDesc=\"ScalarValue\",LinkVar=None,PropertyName=ScalarValue,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        MatInst:'MatInst',
        ParamName:'ParamName',
        ScalarValue:'ScalarValue'
    }
}
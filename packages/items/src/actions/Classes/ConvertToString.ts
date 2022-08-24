import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ConvertToString extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_ConvertToString'Engine.Default__SeqAct_ConvertToString'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_Object',LinkedVariables=none,LinkDesc=\"Inputs\",LinkVar=None,PropertyName=Targets,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=true,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=class'SeqVar_String',LinkedVariables=none,LinkDesc=\"Output\",LinkVar=None,PropertyName=None,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        bIncludeVarComment:'bIncludeVarComment',
        VarSeparator:'VarSeparator',
        NumberOfInputs:'NumberOfInputs'
    }
}
import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class GetFTEState extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_GetFTEState_TA'TAGame.Default__SeqAct_GetFTEState_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_String',LinkedVariables=none,LinkDesc=\"CheckpointName\",LinkVar=None,PropertyName=CheckpointName,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_Bool',LinkedVariables=none,LinkDesc=\"bIsActive\",LinkVar=None,PropertyName=bIsActive,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        CheckpointName:'CheckpointName',
        bIsActive:'bIsActive'
    }
}
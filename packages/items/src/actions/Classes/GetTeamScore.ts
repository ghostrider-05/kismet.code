import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class GetTeamScore extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_GetTeamScore_TA'TAGame.Default__SeqAct_GetTeamScore_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Int',LinkedVariables=none,LinkDesc=\"Team Index\",LinkVar=None,PropertyName=TeamIndex,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_Int',LinkedVariables=none,LinkDesc=\"Team Score\",LinkVar=None,PropertyName=TeamScore,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        TeamIndex:'TeamIndex',
        TeamScore:'TeamScore'
    }
}
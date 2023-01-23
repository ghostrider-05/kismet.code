import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class CinematicIntroStartNextSequence extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_CinematicIntroStartNextSeq_TA'TAGame.Default__SeqAct_CinematicIntroStartNextSeq_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Int',LinkedVariables=none,LinkDesc=\"SequenceIndex\",LinkVar=None,PropertyName=CurrentSequenceIndex,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        CurrentSequenceIndex:'CurrentSequenceIndex'
    }
}
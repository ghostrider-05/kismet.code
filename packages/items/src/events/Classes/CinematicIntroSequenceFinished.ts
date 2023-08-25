import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class CinematicIntroSequenceFinished extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_CinematicIntroSeqFinished_TA'TAGame.Default__SeqEvent_CinematicIntroSeqFinished_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Int',LinkDesc=\"SequenceIndex\",LinkVar=None,PropertyName=SequenceIndex,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=None,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            },
            ...options
        })
    }
}
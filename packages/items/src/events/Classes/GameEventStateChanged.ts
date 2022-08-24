import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class GameEventStateChanged extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_GameEventStateChanged_TA'TAGame.Default__SeqEvent_GameEventStateChanged_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_String',LinkedVariables=none,LinkDesc=\"State Name\",LinkVar=None,PropertyName=StateName,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            },
            ...options
        })
    }
}
import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class InputSequence extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_InputSequence_TA'TAGame.Default__SeqEvent_InputSequence_TA'",
            inputs: {
                "input": [],
                "output": [
                    "(Links=none,LinkDesc=\"Activated\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Name',LinkedVariables=none,LinkDesc=\"Name\",LinkVar=None,PropertyName=SequenceName,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            },
            ...options
        })
    }
}
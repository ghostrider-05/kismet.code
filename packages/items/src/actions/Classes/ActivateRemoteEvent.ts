import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ActivateRemoteEvent extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_ActivateRemoteEvent'Engine.Default__SeqAct_ActivateRemoteEvent'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_Object',LinkDesc=\"Instigator\",LinkVar=None,PropertyName=Instigator,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=None,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        Instigator:'Instigator',
        EventName:'EventName',
        bStatusIsOk:'bStatusIsOk'
    }
}
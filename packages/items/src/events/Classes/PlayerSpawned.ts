import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class PlayerSpawned extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_PlayerSpawned'Engine.Default__SeqEvent_PlayerSpawned'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_Object',LinkedVariables=none,LinkDesc=\"Instigator\",LinkVar=None,PropertyName=None,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=class'SeqVar_Object',LinkedVariables=none,LinkDesc=\"Spawn Location\",LinkVar=None,PropertyName=SpawnLocation,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=class'SeqVar_Object',LinkedVariables=none,LinkDesc=\"Spawn Rotation\",LinkVar=None,PropertyName=SpawnRotation,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            },
            ...options
        })
    }
}
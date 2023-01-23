import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SpawnActor extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SpawnActor_TA'TAGame.Default__SeqAct_SpawnActor_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"Actor Archetype\",LinkVar=None,PropertyName=ActorArchetype,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"Transform\",LinkVar=None,PropertyName=Transform,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"Spawned Actor\",LinkVar=None,PropertyName=SpawnedActor,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        ActorArchetype:'ActorArchetype',
        Transform:'Transform',
        SpawnedActor:'SpawnedActor'
    }
}
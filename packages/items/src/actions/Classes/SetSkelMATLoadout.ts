import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetSkelMATLoadout extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetSkelMATLoadout_TA'TAGame.Default__SeqAct_SetSkelMATLoadout_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkDesc=\"Skel MAT\",LinkVar=None,PropertyName=ActorMAT,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=None,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkDesc=\"Player\",LinkVar=None,PropertyName=ControllerOrPawn,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=None,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        ActorMAT:'ActorMAT',
        ControllerOrPawn:'ControllerOrPawn',
        LoadoutIndex:'LoadoutIndex'
    }
}
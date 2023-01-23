import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetBreakoutPlatformDamage extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetBreakoutTileDamage_TA'TAGame.Default__SeqAct_SetBreakoutTileDamage_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"Breakout Platform\",LinkVar=None,PropertyName=PlatformObj,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_Int',LinkedVariables=none,LinkDesc=\"Damage\",LinkVar=None,PropertyName=Damage,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        PlatformObj:'PlatformObj',
        Damage:'Damage'
    }
}
import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class GetRarityColor extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_GetRarityColor_TA'TAGame.Default__SeqAct_GetRarityColor_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Int',LinkedVariables=none,LinkDesc=\"Rarity Index\",LinkVar=None,PropertyName=ColorIdx,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_Bool',LinkedVariables=none,LinkDesc=\"Random\",LinkVar=None,PropertyName=bRandomize,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_Vector',LinkedVariables=none,LinkDesc=\"Color\",LinkVar=None,PropertyName=OutColor,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        RarityColorsPrime:'RarityColorsPrime',
        bRandomize:'bRandomize',
        MinimumRandomQuality:'MinimumRandomQuality',
        ColorIdx:'ColorIdx',
        OutColor:'OutColor',
        LastRandomIdx:'LastRandomIdx'
    }
}
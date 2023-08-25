import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ApplyCarProducts extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_ApplyCarProducts_TA'TAGame.Default__SeqAct_ApplyCarProducts_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_Object',LinkDesc=\"CarPreviewActor\",LinkVar=None,PropertyName=CarPreviewActor,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=None,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        Assets:'Assets',
        TeamColor:'TeamColor',
        AccentColor:'AccentColor',
        TeamFinish:'TeamFinish',
        CustomFinish:'CustomFinish',
        CarPreviewActor:'CarPreviewActor'
    }
}
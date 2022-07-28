/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class ApplyCarProducts extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_ApplyCarProducts_TA'TAGame.Default__SeqAct_ApplyCarProducts_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": [
			        "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"CarPreviewActor\",LinkVar=None,PropertyName=CarPreviewActor,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
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
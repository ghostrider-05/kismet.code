/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class GetPlayerCar extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_GetPlayerCar_TA'TAGame.Default__SeqAct_GetPlayerCar_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": [
			        "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"Found Actor\",LinkVar=None,PropertyName=FoundActor,bWriteable=true,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ]
			}
        })
    }
    static Variables = {
    	PlayerName:'PlayerName',
		FoundActor:'FoundActor'
    }
}
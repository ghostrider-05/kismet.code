/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class ReinitializeRBPhysics extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_ReinitPhys_TA'TAGame.Default__SeqAct_ReinitPhys_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": [
			        "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"RB Actor\",LinkVar=None,PropertyName=RBObj,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ]
			}
        })
    }
    static Variables = {
    	RBObj:'RBObj'
    }
}
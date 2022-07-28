/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class SetVectorParamMatInst extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetMatInstVectorParam_TA'TAGame.Default__SeqAct_SetMatInstVectorParam_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": [
			        "(ExpectedType=Class'Engine.SeqVar_Vector',LinkedVariables=none,LinkDesc=\"VectorValue\",LinkVar=None,PropertyName=VectorValue,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
			        "(ExpectedType=Class'Engine.SeqVar_Object',LinkedVariables=none,LinkDesc=\"MatInstValue\",LinkVar=None,PropertyName=MatInst,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ]
			}
        })
    }
    static Variables = {
    	MatInst:'MatInst',
		ParamName:'ParamName',
		VectorValue:'VectorValue'
    }
}
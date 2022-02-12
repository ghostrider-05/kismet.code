/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceCondition } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class CompareString extends SequenceCondition {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
                ObjectArchetype: "SeqCond_CompareString_TA'TAGame.Default__SeqCond_CompareString_TA'",
                inputs: {
			    "input": [],
			    "output": [
			        "(Links=none,LinkDesc=\"True\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)",
			        "(Links=none,LinkDesc=\"False\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
			    ],
			    "variable": [
			        "(ExpectedType=Class'Engine.SeqVar_String',LinkedVariables=none,LinkDesc=\"String A\",LinkVar=None,PropertyName=StringA,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
			        "(ExpectedType=Class'Engine.SeqVar_String',LinkedVariables=none,LinkDesc=\"String B\",LinkVar=None,PropertyName=StringB,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ]
			}
            })
        }
            static Variables = {
    	bIgnoreCase:'bIgnoreCase',
		StringA:'StringA',
		StringB:'StringB'
    }
}
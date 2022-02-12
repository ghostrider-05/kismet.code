/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class SetScalarParam extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetMatInstScalarParam'Engine.Default__SeqAct_SetMatInstScalarParam'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": [
			        "(ExpectedType=class'SeqVar_Float',LinkedVariables=none,LinkDesc=\"ScalarValue\",LinkVar=None,PropertyName=ScalarValue,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ]
			}
        })
    }
    static Variables = {
    	MatInst:'MatInst',
		ParamName:'ParamName',
		ScalarValue:'ScalarValue'
    }
}
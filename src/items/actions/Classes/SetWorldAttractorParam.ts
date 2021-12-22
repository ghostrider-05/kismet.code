/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class SetWorldAttractorParam extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetWorldAttractorParam'Engine.Default__SeqAct_SetWorldAttractorParam'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	Attractor:'Attractor',
		bEnabledField:'bEnabledField',
		bFalloffTypeField:'bFalloffTypeField',
		bFalloffExponentField:'bFalloffExponentField',
		bRangeField:'bRangeField',
		bStrengthField:'bStrengthField',
		bEnabled:'bEnabled',
		FalloffType:'FalloffType',
		FalloffExponent:'FalloffExponent',
		Range:'Range',
		Strength:'Strength'
    }
}
/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class FeatureTest extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_FeatureTest'Engine.Default__SeqAct_FeatureTest'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	FreezeAtParameters:'FreezeAtParameters',
		ScreenShotDelay:'ScreenShotDelay',
		ScreenShotName:'ScreenShotName',
		RemainingScreenShotDelay:'RemainingScreenShotDelay'
    }
}
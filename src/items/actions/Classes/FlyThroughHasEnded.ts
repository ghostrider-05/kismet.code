/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class FlyThroughHasEnded extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_FlyThroughHasEnded'Engine.Default__SeqAct_FlyThroughHasEnded'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
}
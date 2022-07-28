/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class ANDGate extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_AndGate'Engine.Default__SeqAct_AndGate'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	bOpen:'bOpen',
		LinkedOutputFiredStatus:'LinkedOutputFiredStatus',
		LinkedOutputs:'LinkedOutputs'
    }
}
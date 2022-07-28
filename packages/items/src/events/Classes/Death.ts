/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceEvent } from "../../../structures/Sequence/index.js";
import { KismetEventOptions } from "../../../types/index.js";
export class Death extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_Death'Engine.Default__SeqEvent_Death'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			},
            ...options
        })
    }
}
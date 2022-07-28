/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceEvent } from "../../../structures/Sequence/index.js";
import { KismetEventOptions } from "../../../types/index.js";
export class AnimNotify extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_AnimNotify'Engine.Default__SeqEvent_AnimNotify'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			},
            ...options
        })
    }
}
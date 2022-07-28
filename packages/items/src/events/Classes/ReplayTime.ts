/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceEvent } from "../../../structures/Sequence/index.js";
import { KismetEventOptions } from "../../../types/index.js";
export class ReplayTime extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_ReplayTime_TA'TAGame.Default__SeqEvent_ReplayTime_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			},
            ...options
        })
    }
}
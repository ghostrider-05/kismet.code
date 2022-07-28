/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceEvent } from "../../../structures/Sequence/index.js";
import { KismetEventOptions } from "../../../types/index.js";
export class LevelStartup extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_LevelStartup'Engine.Default__SeqEvent_LevelStartup'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			},
            ...options
        })
    }
}
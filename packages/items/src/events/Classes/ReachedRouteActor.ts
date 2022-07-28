/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceEvent } from "../../../structures/Sequence/index.js";
import { KismetEventOptions } from "../../../types/index.js";
export class ReachedRouteActor extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_AIReachedRouteActor'Engine.Default__SeqEvent_AIReachedRouteActor'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			},
            ...options
        })
    }
}
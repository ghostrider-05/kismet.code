import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
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
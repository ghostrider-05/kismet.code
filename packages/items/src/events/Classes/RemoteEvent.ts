import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class RemoteEvent extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_RemoteEvent'Engine.Default__SeqEvent_RemoteEvent'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
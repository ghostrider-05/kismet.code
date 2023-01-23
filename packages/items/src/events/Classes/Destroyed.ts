import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class Destroyed extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_Destroyed'Engine.Default__SeqEvent_Destroyed'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
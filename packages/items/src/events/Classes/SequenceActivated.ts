import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class SequenceActivated extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_SequenceActivated'Engine.Default__SeqEvent_SequenceActivated'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
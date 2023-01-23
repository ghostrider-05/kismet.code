import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
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
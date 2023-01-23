import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class ConsoleEvent extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_Console'Engine.Default__SeqEvent_Console'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
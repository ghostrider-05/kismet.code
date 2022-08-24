import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
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
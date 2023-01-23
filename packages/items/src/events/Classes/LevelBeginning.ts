import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class LevelBeginning extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_LevelBeginning'Engine.Default__SeqEvent_LevelBeginning'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
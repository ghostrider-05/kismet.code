import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class SeeEnemy extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_AISeeEnemy'Engine.Default__SeqEvent_AISeeEnemy'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
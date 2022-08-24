import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class HitWall extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_HitWall'Engine.Default__SeqEvent_HitWall'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
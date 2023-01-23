import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class AnimNotify extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_AnimNotify'Engine.Default__SeqEvent_AnimNotify'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
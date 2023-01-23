import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class ConstraintBroken extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_ConstraintBroken'Engine.Default__SeqEvent_ConstraintBroken'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class ReplayTime extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_ReplayTime_TA'TAGame.Default__SeqEvent_ReplayTime_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
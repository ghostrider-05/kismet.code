import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class CarSpawned extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_CarSpawned_TA'TAGame.Default__SeqEvent_CarSpawned_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
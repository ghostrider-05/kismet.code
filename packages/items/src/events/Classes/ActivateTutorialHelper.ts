import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class ActivateTutorialHelper extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_TutorialHelper_TA'TAGame.Default__SeqEvent_TutorialHelper_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
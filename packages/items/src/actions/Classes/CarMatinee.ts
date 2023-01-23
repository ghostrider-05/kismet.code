import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class CarMatinee extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_CarMatinee_TA'TAGame.Default__SeqAct_CarMatinee_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        CinematicCarArchPath:'CinematicCarArchPath',
        bHideAfterPause:'bHideAfterPause',
        bHideAfterCompleted:'bHideAfterCompleted',
        ClassesToNotShow:'ClassesToNotShow'
    }
}
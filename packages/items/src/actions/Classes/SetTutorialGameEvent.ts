import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetTutorialGameEvent extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_SetTutorialGameEvent_TA'TAGame.Default__SeqAct_SetTutorialGameEvent_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        TutorialType:'TutorialType'
    }
}
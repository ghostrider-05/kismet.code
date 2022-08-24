import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class IntroMenuCarsInPosition extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_IntroMenuCarsInPosition_TA'TAGame.Default__SeqAct_IntroMenuCarsInPosition_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
}
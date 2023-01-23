import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class HideDuplicateCars extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_HideDuplicateCar_TA'TAGame.Default__SeqAct_HideDuplicateCar_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        ActorNameToHide:'ActorNameToHide',
        bKeepAllInstancesHidden:'bKeepAllInstancesHidden',
        bFoundDemoedCar:'bFoundDemoedCar'
    }
}
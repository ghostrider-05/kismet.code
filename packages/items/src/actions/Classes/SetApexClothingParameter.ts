import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetApexClothingParameter extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_SetApexClothingParam'Engine.Default__SeqAct_SetApexClothingParam'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        bEnableApexClothingSimulation:'bEnableApexClothingSimulation'
    }
}
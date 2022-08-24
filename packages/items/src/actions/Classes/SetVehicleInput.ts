import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetVehicleInput extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_SetVehicleInput_TA'TAGame.Default__SeqAct_SetVehicleInput_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        Input:'Input'
    }
}
import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class NonNativeUpdate extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_NonNativeUpdate_X'ProjectX.Default__SeqAct_NonNativeUpdate_X'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
}
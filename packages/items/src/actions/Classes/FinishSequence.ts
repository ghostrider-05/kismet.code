import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class FinishSequence extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_FinishSequence'Engine.Default__SeqAct_FinishSequence'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        OutputLabel:'OutputLabel'
    }
}
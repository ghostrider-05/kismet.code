import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class AbortMove extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_AIAbortMoveToActor'Engine.Default__SeqAct_AIAbortMoveToActor'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
}
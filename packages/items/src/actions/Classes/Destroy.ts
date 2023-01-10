import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class Destroy extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_Destroy'Engine.Default__SeqAct_Destroy'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        bDestroyBasedActors:'bDestroyBasedActors',
        IgnoreBasedClasses:'IgnoreBasedClasses'
    }
}
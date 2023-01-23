import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetPhysics extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetPhysics'Engine.Default__SeqAct_SetPhysics'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        newPhysics:'newPhysics'
    }
}
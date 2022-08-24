import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ApplySoundNode extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_ApplySoundNode'Engine.Default__SeqAct_ApplySoundNode'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        PlaySound:'PlaySound',
        ApplyNode:'ApplyNode'
    }
}
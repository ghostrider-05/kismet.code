import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetTextureParam extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetMatInstTexParam'Engine.Default__SeqAct_SetMatInstTexParam'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        MatInst:'MatInst',
        NewTexture:'NewTexture',
        ParamName:'ParamName'
    }
}
import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetPostProcess extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetPostProcess_TA'TAGame.Default__SeqAct_SetPostProcess_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        Chains:'Chains',
        bReplaceCurrentChain:'bReplaceCurrentChain'
    }
}
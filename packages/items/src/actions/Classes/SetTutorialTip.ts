import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetTutorialTip extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_SetTutorialTip_TA'TAGame.Default__SeqAct_SetTutorialTip_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        Tip:'Tip',
        ActionNames:'ActionNames'
    }
}
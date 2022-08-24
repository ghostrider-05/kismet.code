import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ExitToMainMenu extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_ExitToMainMenu_TA'TAGame.Default__SeqAct_ExitToMainMenu_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
}
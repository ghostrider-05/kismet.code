import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class HighlightReelFinished extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_HighlightReelFinished_TA'TAGame.Default__SeqAct_HighlightReelFinished_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
}
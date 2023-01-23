import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class MatchCountdown extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_MatchCountdown_TA'TAGame.Default__SeqAct_MatchCountdown_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        CountdownTime:'CountdownTime'
    }
}
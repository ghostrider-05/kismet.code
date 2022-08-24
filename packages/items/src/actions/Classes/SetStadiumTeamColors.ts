import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetStadiumTeamColors extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_SetStadiumTeamColors_TA'TAGame.Default__SeqAct_SetStadiumTeamColors_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        BlueColors:'BlueColors',
        OrangeColors:'OrangeColors'
    }
}
import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetReplayCamera extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_SetReplayCamera_TA'TAGame.Default__SeqAct_SetReplayCamera_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        FocusActor:'FocusActor',
        LocationOffset:'LocationOffset',
        Rotation:'Rotation',
        FOV:'FOV'
    }
}
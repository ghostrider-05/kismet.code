import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class UserSettingChanged extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_UserSettingChanged_TA'TAGame.Default__SeqEvent_UserSettingChanged_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
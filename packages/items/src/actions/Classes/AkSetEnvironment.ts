import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class AkSetEnvironment extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_AkEnvironment'AkAudio.Default__SeqAct_AkEnvironment'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        Environment:'Environment',
        Target:'Target'
    }
}
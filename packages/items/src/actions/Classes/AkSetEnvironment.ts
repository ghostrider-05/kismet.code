import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class AkSetEnvironment extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
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
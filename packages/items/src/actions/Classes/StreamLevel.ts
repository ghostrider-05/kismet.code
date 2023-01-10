import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class StreamLevel extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_LevelStreaming'Engine.Default__SeqAct_LevelStreaming'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        Level:'Level',
        LevelName:'LevelName',
        bStatusIsOk:'bStatusIsOk'
    }
}
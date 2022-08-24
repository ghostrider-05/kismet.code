import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class StreamLevels extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_MultiLevelStreaming'Engine.Default__SeqAct_MultiLevelStreaming'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        Levels:'Levels',
        bUnloadAllOtherLevels:'bUnloadAllOtherLevels',
        bStatusIsOk:'bStatusIsOk'
    }
}
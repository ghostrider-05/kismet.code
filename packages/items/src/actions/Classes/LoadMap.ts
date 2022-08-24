import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class LoadMap extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_LoadMap_TA'TAGame.Default__SeqAct_LoadMap_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        Map:'Map'
    }
}
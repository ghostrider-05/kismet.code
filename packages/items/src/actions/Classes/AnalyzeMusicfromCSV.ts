import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class AnalyzeMusicfromCSV extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_AnalyzeMusicFromCsv_TA'TAGame.Default__SeqAct_AnalyzeMusicFromCsv_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        VfTable_FTickableObject:'VfTable_FTickableObject',
        CsvFileName:'CsvFileName',
        StartOverrideTime:'StartOverrideTime',
        OverrideTime:'OverrideTime',
        bTickable:'bTickable'
    }
}
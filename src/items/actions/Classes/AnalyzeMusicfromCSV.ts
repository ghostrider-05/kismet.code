/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class AnalyzeMusicfromCSV extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
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
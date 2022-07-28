/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class StreamLevels extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
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
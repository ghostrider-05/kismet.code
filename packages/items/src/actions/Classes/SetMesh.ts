/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class SetMesh extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetMesh'Engine.Default__SeqAct_SetMesh'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	NewSkeletalMesh:'NewSkeletalMesh',
		NewStaticMesh:'NewStaticMesh',
		MeshType:'MeshType',
		bIsAllowedToMove:'bIsAllowedToMove',
		bAllowDecalsToReattach:'bAllowDecalsToReattach'
    }
}
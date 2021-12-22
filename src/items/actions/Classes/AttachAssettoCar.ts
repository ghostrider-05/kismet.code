/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../types/index.js";
export class AttachAssettoCar extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_AttachAssetToCar_TA'TAGame.Default__SeqAct_AttachAssetToCar_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	StaticMeshToAttach:'StaticMeshToAttach',
		SkeletalMeshToAttach:'SkeletalMeshToAttach',
		ParticleSystemToAttach:'ParticleSystemToAttach',
		BoneToAttachTo:'BoneToAttachTo'
    }
}
import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class AttachAssettoCar extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
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
import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetMesh extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
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
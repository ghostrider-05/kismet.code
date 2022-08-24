import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ChangeCollision extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_ChangeCollision'Engine.Default__SeqAct_ChangeCollision'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        bCollideActors:'bCollideActors',
        bBlockActors:'bBlockActors',
        bIgnoreEncroachers:'bIgnoreEncroachers',
        CollisionType:'CollisionType'
    }
}
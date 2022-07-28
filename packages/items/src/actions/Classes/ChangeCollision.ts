/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class ChangeCollision extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
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
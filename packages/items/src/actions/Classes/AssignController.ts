/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class AssignController extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_AssignController'Engine.Default__SeqAct_AssignController'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	ControllerClass:'ControllerClass'
    }
}
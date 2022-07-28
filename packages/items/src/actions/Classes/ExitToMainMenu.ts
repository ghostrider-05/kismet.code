/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class ExitToMainMenu extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_ExitToMainMenu_TA'TAGame.Default__SeqAct_ExitToMainMenu_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
}
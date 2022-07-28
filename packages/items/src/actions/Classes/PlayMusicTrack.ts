/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class PlayMusicTrack extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_PlayMusicTrack'Engine.Default__SeqAct_PlayMusicTrack'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	MusicTrack:'MusicTrack'
    }
}
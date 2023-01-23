import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class PlayMusicTrack extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
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
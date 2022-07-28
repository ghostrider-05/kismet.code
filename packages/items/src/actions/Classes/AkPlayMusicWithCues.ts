
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class AkPlayMusicWithCues extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_AkPlayMusicWithCues'AkAudio.Default__SeqAct_AkPlayMusicWithCues'",
            inputs: {
			    "input": [
			        "(LinkDesc=\"Play\",bHasImpulse=false,QueuedActivations=0,bDisabled=false,bDisabledPIE=false,LinkedOp=none,DrawY=0,bHidden=false,ActivateDelay=0.0,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
			    ],
			    "output": [
			        "(Links=none,LinkDesc=\"Out\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=none,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
			    ],
			    "variable": []
			}
        })
    }
    static Variables = {
    	SoundCue:'SoundCue',
		MusicSyncEvents:'MusicSyncEvents'
    }
}
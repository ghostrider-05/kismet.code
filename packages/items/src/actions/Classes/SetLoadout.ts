/* eslint-disable no-mixed-spaces-and-tabs */
import { SequenceAction } from "../../../../../src/structures/Sequence/index.js";
import type { BaseKismetActionRequiredOptions } from "../../../../../src/types/index.js";
export class SetLoadout extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjectArchetype: "SeqAct_SetLoadout_TA'TAGame.Default__SeqAct_SetLoadout_TA'",
            inputs: {
			    "input": [],
			    "output": [],
			    "variable": []
			}
        })
    }
    static Variables = {
    	Products:'Products',
		ProductsWithPaint:'ProductsWithPaint',
		TeamFinish:'TeamFinish',
		AccentFinish:'AccentFinish',
		bUseInGameColors:'bUseInGameColors',
		bOverwriteCurrent:'bOverwriteCurrent',
		bUseDefaultLoadout:'bUseDefaultLoadout',
		bApplyToAllCars:'bApplyToAllCars',
		TeamColor:'TeamColor',
		AccentColor:'AccentColor',
		ForcedTeamOverride:'ForcedTeamOverride',
		BodyPaint:'BodyPaint',
		SkinPaint:'SkinPaint',
		WheelPaint:'WheelPaint',
		BoostPaint:'BoostPaint',
		SSTrailPaint:'SSTrailPaint',
		AntennaPaint:'AntennaPaint',
		HatPaint:'HatPaint',
		GoalExplosionPaint:'GoalExplosionPaint',
		ParentCar:'ParentCar'
    }
}
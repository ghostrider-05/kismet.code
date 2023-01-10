import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class FeatureTest extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_FeatureTest'Engine.Default__SeqAct_FeatureTest'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        FreezeAtParameters:'FreezeAtParameters',
        ScreenShotDelay:'ScreenShotDelay',
        ScreenShotName:'ScreenShotName',
        RemainingScreenShotDelay:'RemainingScreenShotDelay'
    }
}
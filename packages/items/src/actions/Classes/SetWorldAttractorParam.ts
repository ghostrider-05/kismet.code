import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetWorldAttractorParam extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_SetWorldAttractorParam'Engine.Default__SeqAct_SetWorldAttractorParam'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        Attractor:'Attractor',
        bEnabledField:'bEnabledField',
        bFalloffTypeField:'bFalloffTypeField',
        bFalloffExponentField:'bFalloffExponentField',
        bRangeField:'bRangeField',
        bStrengthField:'bStrengthField',
        bEnabled:'bEnabled',
        FalloffType:'FalloffType',
        FalloffExponent:'FalloffExponent',
        Range:'Range',
        Strength:'Strength'
    }
}
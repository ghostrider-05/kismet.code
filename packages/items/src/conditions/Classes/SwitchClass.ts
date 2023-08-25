import { SequenceCondition, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SwitchClass extends SequenceCondition {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
                ...options,
                ObjInstanceVersion: undefined,
                ObjectArchetype: "SeqCond_SwitchClass'Engine.Default__SeqCond_SwitchClass'",
                inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_Object',LinkDesc=\"Object\",LinkVar=None,PropertyName=None,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=None,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
            })
        }
    static Variables = {
        ClassArray:'ClassArray'
    }
}
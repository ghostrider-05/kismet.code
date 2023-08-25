import { SequenceCondition, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SwitchObject extends SequenceCondition {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
                ...options,
                ObjInstanceVersion: undefined,
                ObjectArchetype: "SeqCond_SwitchObject'Engine.Default__SeqCond_SwitchObject'",
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
        SupportedValues:'SupportedValues'
    }
}
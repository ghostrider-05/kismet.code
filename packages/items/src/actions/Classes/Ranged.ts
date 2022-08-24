import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class Ranged extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_RangeSwitch'Engine.Default__SeqAct_RangeSwitch'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_Int',LinkedVariables=none,LinkDesc=\"Index\",LinkVar=None,PropertyName=None,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        Ranges:'Ranges'
    }
}
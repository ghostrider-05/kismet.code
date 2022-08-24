import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetMaterial extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_SetMaterial'Engine.Default__SeqAct_SetMaterial'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_Object',LinkedVariables=none,LinkDesc=\"Target\",LinkVar=None,PropertyName=Targets,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=true,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        NewMaterial:'NewMaterial',
        MaterialIndex:'MaterialIndex'
    }
}
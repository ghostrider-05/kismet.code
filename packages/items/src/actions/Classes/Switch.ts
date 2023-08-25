import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class Switch extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_Switch'Engine.Default__SeqAct_Switch'",
            inputs: {
                "input": [],
                "output": [
                    "(LinkDesc=\"Link 1\",bHasImpulse=false,bDisabled=false,bDisabledPIE=false,LinkedOp=None,ActivateDelay=0.0,DrawY=0,bHidden=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0,PIEActivationTime=0.0,bIsActivated=false)"
                ],
                "variable": [
                    "(ExpectedType=class'SeqVar_Int',LinkDesc=\"Index\",LinkVar=None,PropertyName=Indices,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=None,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        LinkCount:'LinkCount',
        IncrementAmount:'IncrementAmount',
        bLooping:'bLooping',
        bAutoDisableLinks:'bAutoDisableLinks',
        Indices:'Indices'
    }
}
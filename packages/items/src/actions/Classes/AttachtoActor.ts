import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class AttachtoActor extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: undefined,
            ObjectArchetype: "SeqAct_AttachToActor'Engine.Default__SeqAct_AttachToActor'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=class'SeqVar_Object',LinkDesc=\"Target\",LinkVar=None,PropertyName=Targets,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=None,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=class'SeqVar_Object',LinkDesc=\"Attachment\",LinkVar=None,PropertyName=None,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=None,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        bDetach:'bDetach',
        bHardAttach:'bHardAttach',
        bUseRelativeOffset:'bUseRelativeOffset',
        bUseRelativeRotation:'bUseRelativeRotation',
        BoneName:'BoneName',
        RelativeOffset:'RelativeOffset',
        RelativeRotation:'RelativeRotation'
    }
}
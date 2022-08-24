import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SetScalarParameteronStaticMeshes extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_SetMeshMaterialScalarParameter_TA'TAGame.Default__SeqAct_SetMeshMaterialScalarParameter_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": [
                    "(ExpectedType=Class'Engine.SeqVar_ObjectList',LinkedVariables=none,LinkDesc=\"Meshes\",LinkVar=None,PropertyName=MeshList,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_Float',LinkedVariables=none,LinkDesc=\"ScalarValue\",LinkVar=None,PropertyName=ScalarValue,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)",
                    "(ExpectedType=Class'Engine.SeqVar_String',LinkedVariables=none,LinkDesc=\"ParamName\",LinkVar=None,PropertyName=ParamName,bWriteable=false,bSequenceNeverReadsOnlyWritesToThisVar=false,bModifiesLinkedObject=false,bHidden=false,MinVars=1,MaxVars=255,DrawX=0,CachedProperty=none,bAllowAnyType=false,bMoving=false,bClampedMax=false,bClampedMin=false,OverrideDelta=0)"
                ]
            }
        })
    }
    static Variables = {
        MeshList:'MeshList',
        ParamName:'ParamName',
        ScalarValue:'ScalarValue'
    }
}
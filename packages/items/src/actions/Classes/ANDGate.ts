import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ANDGate extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_AndGate'Engine.Default__SeqAct_AndGate'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        bOpen:'bOpen',
        LinkedOutputFiredStatus:'LinkedOutputFiredStatus',
        LinkedOutputs:'LinkedOutputs'
    }
}
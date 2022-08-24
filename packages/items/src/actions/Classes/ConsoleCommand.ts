import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class ConsoleCommand extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_ConsoleCommand'Engine.Default__SeqAct_ConsoleCommand'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        Command:'Command',
        Commands:'Commands'
    }
}
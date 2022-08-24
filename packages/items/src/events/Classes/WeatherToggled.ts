import { SequenceEvent, KismetEventOptions } from "@kismet.ts/core";
export class WeatherToggled extends SequenceEvent {
    constructor (options?: KismetEventOptions) {
        super({
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqEvent_WeatherToggled_TA'TAGame.Default__SeqEvent_WeatherToggled_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            },
            ...options
        })
    }
}
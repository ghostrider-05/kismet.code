import { SequenceAction, BaseKismetActionRequiredOptions } from "@kismet.ts/core";
export class SpawnCarColors extends SequenceAction {
    constructor (options?: BaseKismetActionRequiredOptions) {
        super({
            ...options,
            ObjInstanceVersion: 3,
            ObjectArchetype: "SeqAct_SpawnCarColors_TA'TAGame.Default__SeqAct_SpawnCarColors_TA'",
            inputs: {
                "input": [],
                "output": [],
                "variable": []
            }
        })
    }
    static Variables = {
        AccentColors:'AccentColors',
        AccentTeamColor:'AccentTeamColor',
        BlueTeamColors:'BlueTeamColors',
        OrangeTeamColors:'OrangeTeamColors',
        TeamAccentColor:'TeamAccentColor',
        Body:'Body',
        Skin:'Skin',
        CarYaw:'CarYaw',
        CarOffsetX:'CarOffsetX',
        CarOffsetY:'CarOffsetY',
        SetOffsetY:'SetOffsetY',
        BaseOffsetY:'BaseOffsetY'
    }
}
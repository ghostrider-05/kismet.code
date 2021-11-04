import { ObjectVariable } from "./Object.js"

import { 
    addVariable,
    boolToKismet
} from "../../shared/index.js"

import type { 
    KismetVariableOptions 
} from "../../types/index.js"

export class PlayerVariable extends ObjectVariable {
    public allPlayers: boolean;
    public playerIndex: number;

    constructor (options?: KismetVariableOptions) {
        super(options)

        this.allPlayers = true
        this.playerIndex = 0

        this.setKismetSetting('ObjectArchetype', `SeqVar_Player'Engine.Default__SeqVar_Player'`)
    }

    public setAllPlayer (enabled: boolean): this {
        this.allPlayers = enabled

        return this
    }

    public setPlayerIndex (index: number): this {
        this.playerIndex = index

        return this
    }

    public override toKismet (): string {
        const properties: [string, string][] = [
            ['PlayerIdx', this.playerIndex.toString()],
            ['bAllPlayers', boolToKismet(this.allPlayers)]
        ]

        return addVariable(super.toKismet(), properties)
    }
}
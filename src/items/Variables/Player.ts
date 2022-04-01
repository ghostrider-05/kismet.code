import { ObjectVariable } from "./Object.js"

import { 
    addVariable,
    boolToKismet
} from "../../shared/index.js"

import type { 
    KismetVariableOptions 
} from "../../types/index.js"

export class PlayerVariable extends ObjectVariable {
    public allPlayers = true
    public playerIndex = 0

    constructor (options?: KismetVariableOptions) {
        super(options)

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

    /**
     * @deprecated
     */
    public override toKismet (): string {
        return this.toString()
    }

    public override toString (): string {
        const properties: [string, string][] = [
            ['PlayerIdx', this.playerIndex.toString()],
            ['bAllPlayers', boolToKismet(this.allPlayers)]
        ]

        return addVariable(super.toString(), properties)
    }
}
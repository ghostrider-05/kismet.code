import { KismetBoolean, KismetVariableOptions } from "@kismet.ts/core"

import { ObjectVariable } from "./Object.js"


export class PlayerVariable extends ObjectVariable {
    public allPlayers = true
    public playerIndex = 0

    constructor (options?: KismetVariableOptions) {
        super(options)

        this.rawData.ObjectArchetype = `SeqVar_Player'Engine.Default__SeqVar_Player'`
    }

    public setAllPlayer (enabled: boolean): this {
        this.allPlayers = enabled

        return this
    }

    public setPlayerIndex (index: number): this {
        this.playerIndex = index

        return this
    }

    public override toString (): string {
        const properties: [string, string][] = [
            ['PlayerIdx', this.playerIndex.toString()],
            ['bAllPlayers', KismetBoolean.toKismet(this.allPlayers)]
        ]

        this.raw.push(...properties)

        return super.toString()
    }
}
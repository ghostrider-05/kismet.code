import { ItemConnection, SequenceNode } from './Item/index.js'
import { SequenceAction } from './Action.js'

import { addVariable, boolToKismet, Constants } from '../../shared/index.js'

import type {
    BaseKismetItemOptions,
    KismetEventOptions,
    KismetVariablesType
} from '../../types/index.js'

export class SequenceEvent<T extends {} = {}> extends SequenceNode {
    public trigger: { maxCount: number; delay: number }
    public playerOnly: boolean
    public clientSideOnly: boolean
    public enabled: boolean

    constructor (options: KismetEventOptions<T> & BaseKismetItemOptions) {
        super({ ...options, type: Constants.NodeType.EVENTS })

        this.trigger = {
            maxCount: options?.maxTriggerCount ?? 0,
            delay: options?.triggerDelay ?? 0.008
        }

        this.enabled = options?.enabled ?? true

        this.playerOnly = options?.playerOnly ?? false
        this.clientSideOnly = options?.clientSideOnly ?? false
    }

    public on<T extends SequenceAction> ({
        name,
        item
    }: {
        name: string
        item: T
    }): this {
        const connection = this.getConnection('output', name) as ItemConnection

        if (connection) {
            connection.addLink(
                item.linkId,
                this.connections?.output.indexOf(connection)
            )
        } else {
            console.warn(
                `Could not find output connection for '${name}' on ${this['kismet']['class']}`
            )
        }

        return this
    }

    public setDisabled (): this {
        this.enabled = false

        return this
    }

    public setDisplay ({
        player,
        client
    }: {
        player?: boolean
        client?: boolean
    }): this {
        if (player != null) {
            this.playerOnly = player
        }

        if (client != null) {
            this.clientSideOnly = client
        }

        return this
    }

    public setTrigger ({ max, delay }: { max?: number; delay?: number }): this {
        if (max != null) {
            this.trigger.maxCount = max
        }

        if (delay != null) {
            this.trigger.delay = delay
        }

        return this
    }

    public override toJSON (): Record<string, KismetVariablesType> {
        const variables = [
            ['MaxTriggerCount', this.trigger.maxCount],
            ['ReTriggerDelay', this.trigger.delay],
            ['bEnabled', boolToKismet(this.enabled)],
            ['bPlayerOnly', boolToKismet(this.playerOnly)],
            ['bClientSideOnly', boolToKismet(this.clientSideOnly)]
        ].reduce(
            (prev, curr) => ({
                ...prev,
                [curr[0]]: curr[1]
            }),
            {}
        )

        return {
            ...variables,
            ...super.toJSON()
        }
    }

    public override toString (): string {
        const json = super.toJSON()

        const variables = Object.keys(json).map(
            n => [n, json[n]] as [string, KismetVariablesType]
        )

        return addVariable(super.toString(), variables)
    }

    /**
     * @deprecated
     */
    public override toKismet (): string {
        return this.toString()
    }
}

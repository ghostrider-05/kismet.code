import { ItemConnection, SequenceNode } from './Item/index.js'

import {
    addVariable,
    boolToKismet,
    Constants,
    KismetError,
} from '../../shared/index.js'

import type {
    BaseKismetItemOptions,
    KismetEventOptions,
    KismetVariablesType,
} from '../../types/index.js'

export class SequenceEvent<T extends {} = {}> extends SequenceNode {
    /**
     * The trigger options for this event
     */
    public trigger: { maxCount: number; delay: number }
    public playerOnly: boolean
    /**
     * @see https://docs.unrealengine.com/udk/Three/KismetUserGuide.html#Client%20Side%20Kismet
     */
    public clientSideOnly: boolean
    public enabled: boolean

    constructor (options: KismetEventOptions<T> & BaseKismetItemOptions) {
        super({ ...options, type: Constants.NodeType.EVENTS })

        this.trigger = {
            maxCount: options?.maxTriggerCount ?? 0,
            delay: options?.triggerDelay ?? 0.008,
        }

        this.enabled = options?.enabled ?? true

        this.playerOnly = options?.playerOnly ?? false
        this.clientSideOnly = options?.clientSideOnly ?? false
    }

    public on<T extends SequenceNode> (
        name: string,
        to: {
            name?: string
            item: T
        }
    ): this {
        const connection = this.getConnection('output', name) as ItemConnection
        const itemConnection = to.item.getConnection(
            'input',
            to.name
        ) as ItemConnection

        if (!to.item.isSequenceNode()) {
            new KismetError('INVALID_NODE_ARGUMENT')
        }

        if (connection && (to.name ? itemConnection : true)) {
            connection.addLink(
                to.item.linkId,
                to.item.connections?.input.indexOf(itemConnection)
            )
        } else {
            new KismetError('UNKNOWN_CONNECTION', [
                to.name ?? name,
                this['kismet']['class'],
            ])
        }

        return this
    }

    /**
     * Disable this event
     */
    public setDisabled (): this {
        this.enabled = false

        return this
    }

    /**
     * Set the client / player display options
     * @param options 
     */
    public setDisplay ({
        player,
        client,
    }: {
        player?: boolean
        client?: boolean
    }): this {
        if (player != undefined) {
            this.playerOnly = player
        }

        if (client != undefined) {
            this.clientSideOnly = client
        }

        return this
    }

    /**
     * Set the trigger options for this event
     * @param options 
     */
    public setTrigger ({ max, delay }: { max?: number; delay?: number }): this {
        if (max != undefined) {
            this.trigger.maxCount = max
        }

        if (delay != undefined) {
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
            ['bClientSideOnly', boolToKismet(this.clientSideOnly)],
        ].reduce(
            (prev, curr) => ({
                ...prev,
                [curr[0]]: curr[1],
            }),
            {}
        )

        return {
            ...variables,
            ...super.toJSON(),
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

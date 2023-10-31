import { Constants, KismetError } from '@kismet.ts/shared'

import { SequenceNode, BaseKismetItemOptions } from '../item/index.js'
import { KismetBoolean } from '../util/Boolean.js'

import type { KismetEventOptions } from './options.js'
import type { KismetVariableValue } from './types.js'

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
        const connection = this.connections.get('output', name)
        const itemConnection = to.item.connections.get('input', to.name)

        if (!to.item.isSequenceNode()) {
            new KismetError('INVALID_NODE_ARGUMENT')
        }

        if (connection && itemConnection) {
            connection.addLink(
                to.item.linkId,
                itemConnection.index
            )
        } else {
            new KismetError('UNKNOWN_CONNECTION', [
                to.name ?? name,
                this.ClassData.Class,
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

    public override toJSON (): Record<string, KismetVariableValue> {
        const variables: [string, string | number][] = [
            ['MaxTriggerCount', this.trigger.maxCount],
            ['ReTriggerDelay', this.trigger.delay],
            ['bEnabled', KismetBoolean.toKismet(this.enabled)],
            ['bPlayerOnly', KismetBoolean.toKismet(this.playerOnly)],
            ['bClientSideOnly', KismetBoolean.toKismet(this.clientSideOnly)],
        ]

        this.raw.push(...variables)

        return super.toJSON()
    }

    public override toString (): string {
        return super.toString()
    }
}

import { SequenceNode } from './Item/index.js'
import { SequenceAction } from "./Action.js";

import { 
    boolToKismet,
    Constants,
    t
} from '../../shared/index.js';

import type { 
    BaseKismetItemOptions, 
    KismetEventOptions 
} from '../../types/index.js'

export class SequenceEvent<T extends {} = {}> extends SequenceNode {
    public trigger: { maxCount: number; delay: number; };
    public playerOnly: boolean;
    public clientSideOnly: boolean;
    public enabled: boolean;

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

    public on<T extends SequenceAction> ({ name, item }: { name: string, item: T }): this {
        const connection = this.getConnection('output', name)

        if (connection) {
            connection.addLink(t<SequenceAction>(item).linkId, this.connections?.output.indexOf(connection))
        } else {
            console.warn(`Could not find output connection for '${name}' on ${this['kismet']['class']}`)
        }

        return this
    }

    public setDisabled (): this {
        this.enabled = false

        return this
    }

    public setDisplay ({ player, client }: {
        player?: boolean,
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

    public setTrigger ({ max, delay } : {
        max?: number,
        delay?: number
    }): this {
        if (max != null) {
            this.trigger.maxCount = max
        }

        if (delay != null) {
            this.trigger.delay = delay
        }

        return this
    }

    public override toKismet(): string {

        const variables: [string, string | number][] = [
            ['MaxTriggerCount', this.trigger.maxCount],
            ['ReTriggerDelay', this.trigger.delay],
            ['bEnabled', boolToKismet(this.enabled)],
            ['bPlayerOnly', boolToKismet(this.playerOnly)],
            ['bClientSideOnly', boolToKismet(this.clientSideOnly)]
        ]

        variables.forEach(v => super.setVariable(v[0], v[1]))

        return super.toKismet()
    }
}
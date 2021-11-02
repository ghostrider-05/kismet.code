import { SequenceNode } from './Item/index.js'
import { SequenceAction } from "./Action.js";

import { 
    boolToKismet,
    t
} from '../../shared/index.js';

import type { 
    BaseKismetItemOptions, 
    KismetEventOptions 
} from '../../types/index.js'

export class SequenceEvent<T extends {} = {}, E extends string = 'Out'> extends SequenceNode {
    public trigger: { maxCount: number; delay: number; };
    public playerOnly: boolean;
    public clientSideOnly: boolean;
    public enabled: boolean;

    constructor (options: KismetEventOptions<T> & BaseKismetItemOptions) {
        super(options)

        this.trigger = {
            maxCount: options?.maxTriggerCount ?? 0,
            delay: options?.triggerDelay ?? 0.008
        }

        this.enabled = options?.enabled ?? true

        this.playerOnly = options?.playerOnly ?? false
        this.clientSideOnly = options?.clientSideOnly ?? false

    }

    public on<T = SequenceAction | unknown> ({ name, item }: { name: E, item: T }): this {
        const connection = this.getConnection('output', name)

        if (connection) {
            connection.addLink(t<SequenceAction>(item).linkId, this.connections.output.indexOf(connection))
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
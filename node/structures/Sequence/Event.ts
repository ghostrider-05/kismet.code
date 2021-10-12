import { KismetItemConfigOptions, SequenceNode } from "./Item.js";

import type { KismetEventOptions } from '../../types/index.js'
import { SequenceAction } from "./Action.js";

export class SequenceEvent<T extends {} = {}, E extends string = 'Out'> extends SequenceNode {
    public trigger: { maxCount: number; delay: number; };
    public playerOnly: boolean;
    public clientSideOnly: boolean;
    public enabled: boolean;

    constructor (options: KismetEventOptions<T> & KismetItemConfigOptions) {
        super(options)

        this.trigger = {
            maxCount: options?.maxTriggerCount ?? 0,
            delay: options?.triggerDelay ?? 0.008
        }

        this.enabled = options?.enabled ?? true

        this.playerOnly = options?.playerOnly ?? false
        this.clientSideOnly = options?.clientSideOnly ?? false

    }

    on<T = SequenceAction | unknown> ({ name, item }: { name: E, item: T }): this {
        const connection = this.getConnection('output', name)

        if (connection) {
            connection.addLink((item as unknown as SequenceAction).linkId, this.connections.output.indexOf(connection))
        }

        return this
    }
}
import { KismetItemConfigOptions, SequenceNode } from "./Item.js";

import type { KismetEventOptions } from '../../types/index.js'
import { SequenceAction } from "./Action.js";

export class SequenceEvent<T extends {} = {}, E extends string = 'Out'> extends SequenceNode {
    public trigger: { maxCount: number; delay: number; };
    public playerOnly: boolean;
    public clientSideOnly: boolean;
    public enabled: boolean;

    private connectedItems: { name: string, items: SequenceAction[]}[]
    private connections: { out: string[]; variables: string[]; };

    constructor (options: KismetEventOptions<T> & KismetItemConfigOptions) {
        super(options)

        this.trigger = {
            maxCount: options?.maxTriggerCount ?? 0,
            delay: options?.triggerDelay ?? 0.008
        }

        this.enabled = options?.enabled ?? true

        this.playerOnly = options?.playerOnly ?? false
        this.clientSideOnly = options?.clientSideOnly ?? false

        this.connectedItems = []
        
        this.connections = {
            out: ['out'],
            variables: []
        }
    }

    on<T = SequenceAction | unknown> ({ name, item }: { name: E, item: T }): this {
        if (this.connections.out.some(x => x === name)) {
            if (!this.connectedItems.some(x => x.name === name)) {
                this.connectedItems.push({ name: name, items: []})
            }

            this.connectedItems.find(x => x.name === name)?.items.push(item as unknown as SequenceAction)
        }

        return this
    }
}
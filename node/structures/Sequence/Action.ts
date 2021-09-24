import { KismetItemConfigOptions, SequenceNode } from './Item.js'

import type { KismetActionRequiredOptions } from '../../types/index.js'
import { SequenceEvent } from './Event.js'

export class SequenceAction<C extends string = 'out', V extends string = ''> extends SequenceNode<V> {
    private connectedItems: { items: (SequenceAction | SequenceEvent)[], name: string }[]

    constructor (options: KismetActionRequiredOptions & KismetItemConfigOptions) {
        super(options)

        this.connectedItems = []
    } 

    addConnection (item: SequenceAction, name?: C): this {
        const tag = name ?? 'out'

        if (this.connectionNames.out.includes(tag)) {
            if (!this.connectedItems.some(x => x.name === tag)) {
                this.connectedItems.push({ name: tag, items: []})
            }

            this.connectedItems.find(x => x.name === tag)?.items.push(item)
        }

        return this
    }
}
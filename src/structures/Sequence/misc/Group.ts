import { Sequence } from '../../index.js'

import type {
    KismetConnectionType,
    KismetPosition,
    SequenceItemType,
} from '../../../types/index.js'

export type KismetGroupResolverIdType = string | number

export interface KismetGroupSchema {
    /**
     * Define outside connections
     */
    links: Record<
        KismetConnectionType,
        { id: KismetGroupResolverIdType; name: string }[]
    >
    /**
     * The name of the group
     */
    name: string
    /**
     * The id of the group
     */
    id: string

    resolvers: {
        linkId: string
        id: KismetGroupResolverIdType
    }[]

    items: SequenceItemType[]
}

export interface KismetGroupSerializeOptions {
    position?: KismetPosition
}

export class KismetGroup {
    private schema: KismetGroupSchema
    public name: string
    public items: SequenceItemType[] = []

    constructor (schema: KismetGroupSchema) {
        this.schema = schema
        const { name, items } = schema

        this.name = name
        this.items = items
    }

    private resolveConnection (schema: {
        name: string
        id: KismetGroupResolverIdType
    }) {
        const { links } = this.schema

        const values = Object.keys(links)
            .map(key => {
                const items = links[key as KismetConnectionType]
                const item = items.find(
                    i => i.id === schema.id && i.name === schema.name
                )

                if (item)
                    return {
                        type: key as KismetConnectionType,
                        ...item,
                    }
            })
            .filter(n => n)

        return values.length > 0 ? values[0] : undefined
    }

    public resolveItem (
        id: KismetGroupResolverIdType
    ): SequenceItemType | undefined {
        const linkId = this.schema.resolvers.find(
            item => item.id === id
        )?.linkId

        return linkId
            ? this.items.find(item => item.linkId === linkId)
            : undefined
    }

    public setOutsideConnection (
        from: { id: KismetGroupResolverIdType; name: string },
        to: { item: SequenceItemType; name: string; type: KismetConnectionType }
    ) {
        const item = this.resolveItem(from.id)
        const link = this.resolveConnection(from)

        const itemLink = to.item.getConnection(to.type, to.name)
        const index = itemLink?.isItemConnection()
            ? to.item.connections?.input.indexOf(itemLink)
            : undefined

        if (!item || !link) return undefined

        item.getConnection(link.type, link.name)?.addLink(to.item.linkId, index)

        this.items[this.items.indexOf(item)] = item
    }

    public serialize (
        sequence: Sequence,
        options?: KismetGroupSerializeOptions
    ): Sequence {
        return sequence.addItems(
            options
                ? this.items.map(i => {
                      const { position } = options
                      return position ? i.setPosition(position, true) : i
                  })
                : this.items
        )
    }
}

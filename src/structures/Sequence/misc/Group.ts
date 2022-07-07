import { type Sequence } from '../../index.js'

import type {
    KismetConnectionType,
    KismetPosition,
    SequenceItemType,
} from '../../../types/index.js'

export type KismetGroupResolverIdType = string | number

export interface KismetGroupSchema {
    /**
     * The name of the group
     */
    name: string

    /**
     * The id of the group
     */
    id: string

    /**
     * The items in this group.
     * Each item has:
     * - item class
     * - id
     * - outside links (optional)
     */
    items: [
        SequenceItemType,
        KismetGroupResolverIdType,
        Partial<Record<KismetConnectionType, { name: string }[]>> | undefined
    ][]
}

export interface KismetGroupSerializeOptions {
    /**
     * The offset position for each item in the group
     */
    position?: KismetPosition
}

type _KismetGroupConnections = Record<
    KismetConnectionType,
    { id: KismetGroupResolverIdType; name: string }[]
>

function formatConnections (schema: KismetGroupSchema) {
    const links = schema.items
        .filter(item => item[2] != undefined)
        .map(([, id, links]) => {
            const itemLinks = links as NonNullable<Required<typeof links>>

            return Object.keys(itemLinks).reduce(
                (prev, current) => ({
                    ...prev,
                    [current]: itemLinks[<KismetConnectionType>current].map(
                        value => ({ ...value, id })
                    ),
                }),
                {} as Partial<_KismetGroupConnections>
            )
        })

    return ['input', 'output', 'variable'].reduce(
        (prev, key) => ({
            ...prev,
            [key]: links
                .filter(n => n[<KismetConnectionType>key])
                .reduce(
                    (prev, curr) => [
                        ...prev, // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        ...curr[<KismetConnectionType>key]!,
                    ],
                    [] as { name: string; id: KismetGroupResolverIdType }[]
                ),
        }),
        {} as _KismetGroupConnections
    )
}

export class KismetGroup {
    private schema: KismetGroupSchema

    public name: string
    public readonly id: string

    constructor (schema: KismetGroupSchema) {
        this.schema = schema
        const { name, id } = schema

        this.name = name
        this.id = id
    }

    private get connections (): _KismetGroupConnections {
        return formatConnections(this.schema)
    }

    private resolveConnection (schema: {
        name: string
        id: KismetGroupResolverIdType
    }) {
        const values = Object.keys(this.connections)
            .map(key => {
                const items = this.connections[key as KismetConnectionType]
                const item = items?.find(
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

    public resolveInputId (id: KismetGroupResolverIdType) {
        const { input, variable } = this.connections

        const link =
            input?.find(x => x.id === id) ?? variable?.find(x => x.id === id)

        return link ? this.resolveItem(link.id)?.linkId : undefined
    }

    public resolveItem (
        id: KismetGroupResolverIdType
    ): SequenceItemType | undefined {
        const linkId = this.schema.items.find(([, id]) => id === id)?.[0].linkId

        return linkId
            ? this.schema.items.find(([, itemId]) => itemId === id)?.[0]
            : undefined
    }

    public setOutsideConnection (
        from: { id: KismetGroupResolverIdType; name: string },
        to: { item: SequenceItemType; name: string; type: KismetConnectionType }
    ): this | undefined {
        const item = this.resolveItem(from.id)
        const link = this.resolveConnection(from)

        const itemLink = to.item.getConnection(to.type, to.name)
        const index = itemLink?.isItemConnection()
            ? to.item.connections?.input.indexOf(itemLink)
            : undefined

        if (!item || !link) return undefined

        item.getConnection(link.type, link.name)?.addLink(to.item.linkId, index)

        return this.updateItem(from.id, item)
    }

    /**
     * Convert the group to sequence items and add the items to the provided sequence
     * @param sequence The sequence to add the items to
     * @param options The options to apply when adding the items to the sequence
     */
    public serialize (
        sequence: Sequence,
        options?: KismetGroupSerializeOptions
    ): Sequence {
        return sequence.addItems(
            this.schema.items.map(([item]) => {
                if (!options) return item

                const { position } = options
                return position ? item.setPosition(position, true) : item
            })
        )
    }

    /**
     *
     * @param id
     * @param newItem
     * @returns
     */
    public updateItem (
        id: KismetGroupResolverIdType,
        newItem: SequenceItemType
    ): this | undefined {
        const item = this.schema.items.find(i => i[1] === id)
        if (!item) return

        this.schema.items[this.schema.items.indexOf(item)] = [
            newItem,
            item[1],
            item[2],
        ]

        return this
    }
}

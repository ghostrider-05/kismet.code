import { boolToKismet } from "../../shared/index.js";

import { type Sequence } from "./base.js";
import type { 
    KismetVariableValue,
    SequenceItemType
} from "../../types/index.js";

export class SequenceUtil {
    private sequence: Sequence;

    constructor (sequence: Sequence) {
        this.sequence = sequence
    }

    protected toRecord (
        items: (SequenceItemType | Sequence)[], 
        properties: Record<
            | 'x'
            | 'y'
            | 'archetype'
            | 'DrawWidth'
            | 'DrawHeight'
            | 'ObjInstanceVersion', 
            string | number>
    ): [string, KismetVariableValue][] {
        const { ObjInstanceVersion, archetype, DrawHeight, DrawWidth, x, y } = properties
        const itemValues = items.map((item, index) => {
            return [`SequenceObjects(${index})`, item.linkId] as [string, string]
        })

        return [
            ...itemValues,
            ['ObjectArchetype', archetype],
            ['ObjName', this.sequence.name],
            ['ObjInstanceVersion', ObjInstanceVersion],
            ['DrawWidth', DrawWidth],
            ['DrawHeight', DrawHeight],
            ['Name', this.sequence.name],
            ['ObjPosX', x],
            ['ObjPosY', y],
            ['ParentSequence', this.sequence.parentSequence],
            ['bEnabled', boolToKismet(this.sequence.enabled)],
            ['DefaultViewX', this.sequence.defaultView.x],
            ['DefaultViewY', this.sequence.defaultView.y],
            ['DefaultViewZoom', this.sequence.defaultView.zoom],
        ]
    }

    /**
     * Find the first connected event that is the input of a node
     * @param actionId The id of the node to find the event for
     * @param event The event information
     * @param event.connectionName The output name of the link from the event node
     */
    public findConnectedEvent (
        actionId: string,
        event: { 
            id: string; 
            connectionName?: string 
        }
    ): SequenceItemType | undefined {
        const events = this.sequence.items.filter(n => {
            if (n.isEvent() && n.linkId === event.id) {
                const connectedItems = this.sequence.listConnectedItems(event.id, event.connectionName)

                return connectedItems.includes(actionId)
            } else return false
        })

        return events.length > 0 ? <SequenceItemType>events[0] : undefined
    }

    /**
     * Get all items in this sequence with the same class
     * @param item The item to use as reference
     */
     public filterByClassName (
        item: SequenceItemType | Sequence
    ): (SequenceItemType | Sequence)[] {
        return this.sequence.items.filter(
            n => n.linkId.split("'")[0] === item.linkId.split("'")[0]
        )
    }

    /**
     * Returns the index of the first occurrence of an item in this sequence, or -1 if it is not present.
     * @param id The link id of the item to search
     */
    public indexOf (id: string): number {
        const item = this.sequence.items.find(i => i.linkId === id)
        
        if (!item) return -1
        else return this.sequence.items.indexOf(item)
    }

    /**
     * List all connected items to an item in this sequence
     * @param itemId The link id of the item
     * @param outputConnection The output connection name to find only items to this link
     */
    public listConnectedItems (
        itemId: string,
        outputConnection?: string
    ): string[] {
        const { sequence } = this
        const item = sequence.resolveId(itemId)

        if (item?.isSequenceItem()) {
            const ids = item.connections?.output.flatMap(link =>
                link.name === (outputConnection ?? link.name)
                    ? link.linkedIds
                    : []
            )
            if (!ids || ids.length === 0) return []

            let idsToFilter = ids

            while (idsToFilter.length <= sequence.items.length) {
                const cItems = idsToFilter
                    .map(id => sequence.resolveId(id))
                    .filter(n => n)
                const newIds: string[] = cItems
                    .flatMap(i =>
                        i?.isSequenceItem() && !idsToFilter.includes(i.linkId)
                            ? i.connections?.output.flatMap(
                                  link => link.linkedIds
                              )
                            : undefined
                    )
                    .filter(n => n) as string[]

                if (newIds.length > 0) {
                    idsToFilter = idsToFilter.concat(newIds)
                } else {
                    break
                }
            }

            return idsToFilter
        } else return []
    }
}

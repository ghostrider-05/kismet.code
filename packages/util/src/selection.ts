import { ProcessId, Sequence, SequenceItemType } from "@kismet.ts/core";

export class SequenceSelection<Metadata extends Record<string, unknown>> {
    private items: { id: ProcessId, data: Partial<Metadata> }[] = []

    public get size (): number {
        return this.items.length
    }

    public isInSelection (item: SequenceItemType | Sequence): boolean {
        return this.items.some(i => i.id.equalIds(item.id));
    }

    public add (item: SequenceItemType, data?: Partial<Metadata>): number {
        return this.items.push({ id: item.id, data: data ?? {} })
    }

    public get (item: ProcessId | SequenceItemType): Partial<Metadata> | undefined {
        const id = 'type' in item ? item.id : item
        return this.items.find(i => i.id.equalIds(id))?.data
    }

    public clear (): void {
        this.items = []
    }

    public delete (item: SequenceItemType) {
        this.items = this.items.filter(i => !i.id.equalIds(item.id))
    }

    public deleteSelection (sequence: Sequence): number {
        let clearedItems = 0

        sequence.items = sequence.items.filter(item => {
            const toDelete = this.isInSelection(item)

            if (toDelete) clearedItems += 1
            return toDelete
        })

        return clearedItems
    }
}
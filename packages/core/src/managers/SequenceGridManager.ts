import type { Sequence, KismetPosition, SequenceGridOptions, SequenceItemType } from '../structures/index.js'

export class SequenceGridManager {
    public grid: Partial<KismetPosition> = {}
    public gridWindow: Partial<Record<keyof KismetPosition, [number, number]>> =
        {}

    private enabled = false

    public constructor (options: SequenceGridOptions) {
        this._applyOptions(options)
    }

    private _applyOptions ({ grid, window, enabled }: SequenceGridOptions) {
        this.grid = typeof grid === 'number' ? { x: grid, y: grid } : grid
        this.gridWindow = window ?? {}
        this.enabled = enabled ?? false
    }

    private isInWindow (position: KismetPosition): boolean {
        const { x, y } = this.gridWindow

        const isInAxes = (position: number, window?: [number, number]) => {
            return window ? window[0] < position && position < window[1] : true
        }

        return isInAxes(position.x, x) && isInAxes(position.y, y)
    }

    private applyGridPosition (position: KismetPosition): KismetPosition {
        const calculatePosition = (key: keyof KismetPosition) => {
            const pos = this.grid[key]

            return pos ? Math.ceil(position[key] / pos) * pos : position[key]
        }

        return this.isInWindow(position)
            ? {
                  x: calculatePosition('x'),
                  y: calculatePosition('y'),
              }
            : position
    }

    /** @deprecated */
    public setGrid (
        grid: number | KismetPosition,
        window?: Record<keyof KismetPosition, [number, number]>
    ) {
        this._applyOptions({ grid, window })

        return this
    }

    public applyGridToItems (items: (SequenceItemType | Sequence)[], parent?: Sequence) {
        const update = (item: SequenceItemType) => {
            item.setPosition(this.applyGridPosition(item.position))
            parent?.update(item)
        }

        for (const item of items) {
            item.isSequenceItem()
                ? update(item)
                : item.isSequence()
                    ? this.applyGridToSequence(item)
                    : undefined
        }

        return items
    }

    public applyGridToSequence (sequence: Sequence): Sequence {
        if (!this.enabled || Object.keys(this.grid).length === 0) return sequence

        this.applyGridToItems(sequence.items, sequence)

        return sequence
    }
}

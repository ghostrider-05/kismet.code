import type { Sequence } from "../Sequence/base.js";

import type { KismetPosition } from "../../types/index.js";

export class SequenceGridManager {
    public grid: Partial<KismetPosition> = {}
    public gridWindow: Partial<Record<keyof KismetPosition, [number, number]>> = {}

    private isInWindow (position: KismetPosition): boolean {
        const { x, y } = this.gridWindow

        const isInAxes = (position: number, window?: [number, number]) => {
            return window ? (window[0] < position && position < window[1]) : true
        }

        return isInAxes(position.x, x) && isInAxes(position.y, y)
    }

    private applyGridPosition (position: KismetPosition): KismetPosition {
        const {x, y } = this.grid
    
        return this.isInWindow(position) ? {
            x: x ? Math.ceil(position.x / x) * x : position.x,
            y: y ? Math.ceil(position.y / y) * y : position.y
        } : position
    }

    public setGrid (
        grid: KismetPosition, 
        window?: Record<keyof KismetPosition, [number, number]>
    ) {
        this.grid = grid
        this.gridWindow = window ?? {}

        return this
    }

    public applyGridToSequence (sequence: Sequence): Sequence {
        if (Object.keys(this.grid).length === 0) return sequence

        sequence.items.forEach(item => {
            item.isSequenceItem() 
                ? sequence.updateItem(item, item.setPosition(this.applyGridPosition(item['kismet']))) 
                : item.isSequence()
                    ? this.applyGridToSequence(item) 
                    : void 0;
        })

        return sequence
    }
}

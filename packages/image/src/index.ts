import { type SequenceItemType } from "@kismet.ts/core";
import { SequenceCanvas } from './canvas/index.js'

interface DrawNodeOptions<T> { 
    outPath: string 
    width?: number
    height?: number
    save: T
}

export async function drawSingleNode <T extends boolean> (item: SequenceItemType, options: DrawNodeOptions<T>) {
    const canvas = new SequenceCanvas(options.width ?? 600, options.height ?? 300, { padding: 150 })

    if (item.isSequenceActionNode()) {
        canvas.drawActionNode({ x: 'center', y: 50 }, item)
    } else if (item.isEvent()) {
        canvas.drawEventNode({ x: 'center', y: 50 }, item)
    }

    if (options.save) {
        return await canvas.save(options.outPath, 'png') as unknown as Promise<T extends true ? void : Buffer>
    } else {
        return canvas.toBuffer() as unknown as Promise<T extends true ? void : Buffer>
    }
}

export * from './node/index.js'
export {
    SequenceCanvas
}
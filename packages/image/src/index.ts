import { SequenceItemType } from "@kismet.ts/core";
import { Actions, defaultItems } from "@kismet.ts/items";
import { SequenceCanvas } from './canvas/index.js'

interface DrawNodeOptions<T> { 
    outPath: string 
    save: T
}

export async function drawSingleNode <T extends boolean> (item: SequenceItemType, options: DrawNodeOptions<T>) {
    const canvas = new SequenceCanvas(600, 300)

    canvas.drawActionNode({ x: 'center', y: 50 }, item)

    if (options.save) {
        return await canvas.save(options.outPath, 'png') as unknown as Promise<T extends true ? void : Buffer>
    } else {
        return canvas.toBuffer() as unknown as Promise<T extends true ? void : Buffer>
    }
}

for (const item of defaultItems) {
    item.setComment('Hello world!')
    await drawSingleNode(item, { outPath: `./items/${item.ClassData.Class}.png`, save: true })
}


export * from './node/index.js'
export {
    SequenceCanvas
}
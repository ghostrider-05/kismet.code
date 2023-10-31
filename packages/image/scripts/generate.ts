import { listItems } from "@kismet.ts/items";

import { drawSingleNode } from '../src/index.js'

for (const item of listItems().filter(i => !i.isVariable() && i.ClassData.Class.startsWith('Seq'))) {
    await drawSingleNode(item, { 
        outPath: `./dist/items/${item.ClassData.Class}.png`, 
        save: true,
    })
}

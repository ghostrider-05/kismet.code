import { listItems } from "@kismet.ts/items";

import { drawSingleNode } from '../src/index.js'

import config from './update-config.json' assert { type: 'json' }

for (const item of listItems().filter(i => !i.isVariable() && i.ClassData.Class.startsWith('Seq'))) {
    const buffer = await drawSingleNode(item, { 
        outPath: '', 
        save: false,
    })

    await fetch(`https://kismet-cdn.ghostrider.workers.dev/images?name=${item.ClassData.Class}`, {
        method: 'PUT',
        body: buffer,
        headers: {
            'Authorization': config.Authorization
        },
    })
}
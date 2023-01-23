---
title: Clipboard
---

# Clipboard

## Normal clipboard

```ts
import { NodeUtil } from '@kismet.ts/util'

await NodeUtil.clipboard.write(MyAction.toString())
```

## Limited clipboard

If you want to copy a large sequence to the clipboard and experience that UDK will not copy all nodes,
you can use the limited clipboard.

This clipboard will try to limit the amount of nodes per copy / paste.

```ts
import { NodeUtil } from '@kismet.ts/util'
import readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const itemsPerCopy = 20;

const queue = new NodeUtil.LimitedClipboard(itemsPerCopy)
    .start(sequence)

while (queue.next != undefined) {
    // Copy current stack
    await queue.copy()

    // ... await input until it is copied
    await new Promise<string>((resolve) => rl.question('copied?', (answer) => resolve(answer)))

    // Move to the next stack
    queue.next()
}
```

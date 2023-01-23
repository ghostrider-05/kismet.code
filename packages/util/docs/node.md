---
title: Node.js classes
---

# Node.js classes

This package also exports some extended classes.

## NodeKismetFile

Adds some additional functions like copying to clipboard or saving sequences to a file.

```ts
import { NodeKismetFile } from 'kismet.ts'

const project = new NodeKismetFile({ projectName: 'test' })

// ...

// The sequence will be written to sequences/text.txt
await project.save('C:\\kismet\\sequences\\')
```

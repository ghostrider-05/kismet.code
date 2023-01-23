---
title: Node
---

# Text parsers: node

## Raw node

A raw kismet node, can be obtained by copying the node in UDK, can be converted back to a class with `#parseNode`.

## Raw node class

A class definition, defined in `<MyClass>.uc`, can be converted to a class.
This can be used in combination with the `@kismet.ts/parsers-node` package.

```ts
const content = fs.readFileSync('<MyClass>.uc')
const node = TextNodeParser.parseNodeClassFile(content)
```

## Example

```ts
const parser = new TextNodeParser(items, options)

const node1 = parser.parseNodeName('SeqAct_DrawText'),
    node2 = parser.parseNode(`
Begin Object Class=SeqAct_DrawText ...
...
End Object`)
```

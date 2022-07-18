# Text parsers

These are a collection of parser to convert raw text into kismet nodes.

For both parser the code below is the starting point needed to continue

```ts
const items = KismetFile.listDefaultItems()
const options = {
    toString: true
}
```

## Node

```ts
const parser = new Parsers.NodeText(items, options)

const node1 = parser.parseNodeName('SeqAct_DrawText'),
    node2 = parser.parseNode(`
Begin Object Class=SeqAct_DrawText ...
...
End Object`)
```

## Sequence

### Property chain

To repeat multiple `Get Property` nodes seperated by `propertyChar`

```ts
const parser = new Parsers.SequenceText(items, options)

const kismet = parser.parsePropertyChain('Player().PRI.Team.Bla.Bla.Bla')
```

- options for the begin variable can be specified between the brackets: `Player(bAllPlayers=False)`
- type of the last variable can be specified between arrows: `Player().<Integer>Index`

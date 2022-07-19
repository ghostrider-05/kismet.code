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

## Raw sequence

First to parse a sequence define your combinations on two levels: how an item is structured and a series of items

```txt
LevelLoaded:(Loaded and Visible, In) > CompareInt(ValueA=0, ValueB=1):(A < B, Show) > SeqAct_DrawText(String="hello world")
```

In the example above the items are seperated by `>` and this is parsed as follows:

```ts
const parser = new Parsers.SequenceText(KismetFile.listDefaultItems(), {
    newLinesSeperation: 1,
    extractSequenceOrder: block => {
        return [block.split(Parsers.SequenceText.splitChar)]
    },
    extractItem: item => {
        const [begin, connection] = item.split(':')

        const connectionName = connection?.slice(1, -1).split(','),
            itemName = begin.split('(')[0],
            rawVariables = begin.slice(itemName.length + 1, -1),
            variables =
                rawVariables !== '' && !rawVariables.includes('(')
                    ? rawVariables
                    : undefined

        const [name, id] = itemName.includes('?')
            ? itemName.split('?')
            : [itemName, undefined]

        return {
            name,
            id,
            variables,
            inputName: connectionName?.[1].trim(),
            outputName: connectionName?.[0].trim(),
        }
    },
})

// ...then somewhere else in the code
log(parser.parseSequence(example))
```

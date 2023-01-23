---
title: Sequence
---

# Text parsers: sequence

## Property chain

To repeat multiple `Get Property` nodes separated by `propertyChar`

```ts
const parser = new TextSequenceParser(items, options)

const kismet = parser.parsePropertyChain('Player().PRI.Team.Bla.Bla.Bla')
```

- options for the begin variable can be specified between the brackets: `Player(bAllPlayers=False)`
- type of the last variable can be specified between arrows: `Player().<Integer>Index`

> Format: While the begin variable can be any registered variable, such as `Object()`, the variable must start with an uppercase letter and with `()` before the first property.

For good positions, disable all auto positions on the sequence and set the following spacing options:

```ts
const spacing = {
    nodes: 500,
    variable: 150
}
```

## Custom sequence

First to parse a sequence define your combinations on two levels: how an item is structured and a series of items

```txt
LevelLoaded:(Loaded and Visible, In) -> CompareInt(ValueA=0, ValueB=1):(A < B, Show) -> SeqAct_DrawText(String="hello world")
```

In the example above the items are separated by `->` and this is parsed as follows:

```ts
const parser = new TextSequenceParser(items, {
    // Each block is seperated by 1 line break. 
    // This makes multiline possible for (multiple) events with (multiple) actors on the same output.
    newLinesSeperation: 1,
    // Split each node by -> on each line
    extractSequenceOrder: block => {
        return [block.split('->')]
    },
    // Get the name, variables, connections (and id) from 1 item 
    // Items with the same id will be used 
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

## Raw sequence

Sometimes you do not have [a custom sequence](#custom-sequence), but a sequence copied from UDK like this [Get Ball example](https://github.com/RocketLeagueMapmaking/Kismet/blob/master/general/AddCustomGameBall.txt). You can then recreate such a sequence and modify it with code:

```ts
// Read the content of the sequence somewhere
const seq = fs.readFileSync('my_sequence')

// Recreate the sequence
const sequence = parser.parseRawSingleSequence(seq)

// Do something with the sequence
await Util.clipboard.copy(sequence.toString())
```

There is one catch: sub sequences. We used the `#parseRawSingleSequence` method because we knew that the sequence did not contain any sub sequences. If we want to consider sub sequences we only need to modify a small part:

```ts
const sequence = parser.parseRawSequence(seq2, { 
    parseSubSequences: true
})
```

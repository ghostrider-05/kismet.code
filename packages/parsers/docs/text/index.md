# Text parsers

These are a collection of parser to convert raw text into kismet nodes.

For all parsers the code below is the starting point needed to continue.
You can use your own items with `KismetFile#listItems`.

```ts
const items = listDefaultItems()
    .map(item => constructItem(item))
const options = {
    toString: true
}
```

## Return type

The return type of multiple functions in the text parsers are based on `options.toString`.
If you need the whole item returned, set it to `false`.

---
title: Getting started
---

# Getting started

These are a collection of parser to convert raw text into kismet nodes.

For all parsers the code below is the starting point needed to continue.
You can use your own items with `KismetFile#listItems`.

```ts
import { defaultItems } from '@kismet.ts/items'

const items = defaultItems

const options = {
    convertToString: true
}
```

## Property chain

For the `parsePropertyChain` the following options are required:

```ts
import { Items } from '@kismet.ts/items'

const options = {
    //...,
    variables: {
        ...Items.Variables, 
        GetProperty: Items.Actions.GetProperty 
    }
}
```

## Return type

The return type of multiple functions in the text parsers are based on `options.convertToString`.
If you need the whole item returned, set it to `false`.

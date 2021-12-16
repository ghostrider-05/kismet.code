# Code to kismet

Build [kismet nodes][kismetUserGuide] for (the old and dusty) UDK using code! Intented for large .udk files to simplify the process of making kismet nodes

## Installation

Node 16.6.0 or newer is required.

```txt
npm install ghostrider-05/kismet.code
```

## Example

```ts
import { KismetFile } from 'kismet.code'
import { actions, events } from 'my_item_path'

const { Player} =  KismetFile.Items.Variables

const targets = new Player().setAllPlayers(true)

const DrawText = new actions.DrawText()
    .setVariable('String', 'Hello world!')
    .setVariable('Target', targets)

const onMapLoaded = new events.LevelLoaded()
    .on({ name: 'Loaded and Visible', item: DrawText })

const sequence = new KismetFile({ projectName: 'Untitled_0' }).mainSequence

const items = sequence.addItems([onMapLoaded, DrawText])

console.log(items.toKismet())
```

More examples and guides can be found in the `docs` folder

## State and roadmap

This repo is currently in beta version for typescript. For upcoming features take a look at the open issues and [roadmap project](https://github.com/ghostrider-05/kismet.code/projects/1). Discussion and other questions can also be asked on [discord](https://discord.gg/BNe5DhJKC4)

[kismetUserGuide]: https://docs.unrealengine.com/udk/Three/KismetUserGuide.html

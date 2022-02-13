# Code to kismet

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/ghostrider-05/kismet.code.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ghostrider-05/kismet.code/context:javascript)
[![Package version](https://img.shields.io/github/package-json/v/ghostrider-05/kismet.code)][github]
<!-- TODO: Add CI results badge -->

Build [kismet nodes][kismetUserGuide] for (the old and dusty) UDK using code! Intented for large .udk files to simplify the process of making kismet nodes

## Installation

Node 16.6.0 or newer is required.

```txt
npm install kismet.code
```

## Example

```ts
import { KismetFile } from 'kismet.code'

const { Actions, Events, Variables } = KismetFile.Items

const targets = new Variables.Player()
    .setAllPlayers(true)

const DrawText = new Actions.DrawText()
    .setVariable('String', 'Hello world!')
    .setVariable('Target', targets)

const onMapLoaded = new Events.LevelLoaded()
    .on({ name: 'Loaded and Visible', item: DrawText })

const project = new KismetFile({ projectName: 'Untitled_0' })
const sequence = project.mainSequence

sequence.addItems([onMapLoaded, DrawText])

console.log(sequence.toKismet())
```

More examples and guides can be found in the `docs` folder

## Roadmap

For upcoming features take a look at the [roadmap][roadmap]. Discussion and other questions can also be asked in [GitHub discussions][gh-discussions]

[kismetUserGuide]: https://docs.unrealengine.com/udk/Three/KismetUserGuide.html
[github]: https://github.com/ghostrider-05/kismet.code
[gh-discussions]: https://github.com/ghostrider-05/kismet.code/discussions
[roadmap]: https://github.com/users/ghostrider-05/projects/2/views/1

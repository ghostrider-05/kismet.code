# Code to kismet

Build [kismet nodes][kismetUserGuide] for (the old and dusty) UDK using code! Intented for large .udk files to simplify the process of making kismet nodes

## Getting started

To test this repo, clone this repo and make a new file in `/node/`:
```ts
// udk.ts

import { KismetFile } from './index.js'

const delayAction = new KismetFile.actions.Delay()
    .setVariable('duration', 1000)

const levelLoadedEvent = new KismetFile.events.levelLoaded()
    .on({
        name: 'loaded',
        item: delayAction
    })

const kismet = new KismetFile({
    projectName: 'Untitled_0'
}).mainSequence
    .addItems([levelLoadedEvent, delayAction])
    .toKismet()

// log the kismet nodes to stdout
console.log(kismet)
```

Run `npm start` to start the script

## State and roadmap

This repo is currently in alpha version for typescript. For upcoming features take a look at the open issues and roadmap project.

[kismetUserGuide]: https://docs.unrealengine.com/udk/Three/KismetUserGuide.html

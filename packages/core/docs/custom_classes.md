---
title: Custom classes
---

# Custom classes

Custom classes can be created by extending a base structure:

```ts
// structures/MyAction.ts
import { SequenceAction } from '@kismet.ts/core'

export class MyAction extends SequenceAction {
    constructor (options: MyActionOptions) {
        super ({
            ...options,
            ObjectArchetype: 'SeqAct_MyAction\'Package.Default__SeqAct_MyAction\'',

            // Array of strings of the defaultproperties values for links
            // Uses the same formatting as the class in the .uc file for the defaultproperties
            inputs: {
                input: [],
                output: [],
                variable: []
            }
        })
    }
}
```

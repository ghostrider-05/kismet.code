# Custom classes

Custom classes can be created by extending a base structure:

```ts
// structures/MyAction.ts
import { Structures } from 'kismet.code'

export class MyAction extends Structures.SequenceAction {
    constructor (options: MyActionOptions) {
        super ({
            ...options,
            ObjectArchetype: 'SeqAct_MyAction\'Package.Default__SeqAct_MyAction\'',

            // Array of strings of the defaultproperties values for links
            inputs: {
                input: [],
                output: [],
                variable: []
            }
        })
    }
}
```

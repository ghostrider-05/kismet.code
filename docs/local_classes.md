# Adding local classes

> Note: This is only needed once (or when classes are updated) if you need more nodes than the available variables

Since every setup of UDK is different, you will get a better experience by cloning the kismet classes to use it in a project.

## Extract JSON

<!-- TODO: add steps for how to extract JSON files for classes -->

## Generating classes

This file can be separate from your main program and thus can be in any file location.

```ts
import { KismetFile } from 'kismet.code'

const { parser } = new KismetFile({ projectName: 'Local_Classes' })

parser.setImportPath('C:\\ITEM_PATH')
    .setExportPath('C:\\EXPORT_PATH')

await parser.createCustomNodeFiles()
```

To add exports grouped by class package `parser#setGroupExportItems` can be used.

## Import classes

Then you can use the classes in your project:

```ts
import { actions, events } from 'EXPORT_PATH/index.js'

const myAction = new actions.MyAction()

console.log(myAction) // prints the kismet text for the 'MyAction' action
```

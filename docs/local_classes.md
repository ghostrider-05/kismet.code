# Adding local classes

> Note: This is only needed once (or when classes are updated) if you need more nodes than the available variables

Since every setup of UDK is different, you will get a better experience by cloning the kismet classes to use it in a project.

- `KismetFile.Items` will hold the latest Rocket League compatible nodes
- `KismetFile.Items.Variables` will hold the default UDK variables

If your use case is specified here, you do not need to add your local classes and can use the provided items.

## Extract JSON

<!-- TODO: add steps for how to extract JSON files for classes -->

## Generating classes

This file can be separate from your main program and thus can be in any file location.

```ts
import { KismetFile } from 'kismet.ts'

const { classParser } = new KismetFile({ projectName: 'Local_Classes' })

classParser.setImportPath('C:\\ITEM_PATH')
    .setExportPath('C:\\EXPORT_PATH')
    .setClassPackages('Engine') // Only adds kismet classes from these packages

await classParser.createCustomNodeFiles()
```

To add exports grouped by class package `classParser#setExportOptions` can be used.

## Import classes

Then you can use the classes in your project:

```ts
import { actions, events } from 'EXPORT_PATH/index.js'

const myAction = new actions.MyAction()

console.log(myAction) // prints the kismet text for the 'MyAction' action
```

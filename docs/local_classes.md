# Adding local classes

> Note: This is only needed once (or when classes are updated) if you need more nodes than the available variables

Since every setup of UDK is different, you will get a better experience by cloning the kismet classes to use it in a project.

- `KismetFile.Items` will hold the latest Rocket League compatible nodes
- `KismetFile.Items.Variables` will hold the default UDK variables

If your use case is specified here, you do not need to add your local classes and can use the provided items.

## Extract JSON

To generate the classes, a JSON file is used to hold all information about available connections, names, etc.
You can generate the JSON structure (see this page for example) to fill in the details of your own nodes or use [the JSONGenerator](https://ghostrider-05.github.io/ghostrider) to modify the nodes. This file can also be used when you want to generate other file outputs than the JSON file.

## Generating classes

This file can be separate from your main program and thus can be in any file location.

```ts
import { Parsers } from 'kismet.ts'

const classParser = Parsers.Classes
    .setImportPath("C:\\IMPORT_PATH")
    .setExportPath("./export/")
    .setClassPackages(['Engine']) // Only adds kismet classes from these packages
    .setExportOptions({
        blender: true,
        types: [Constants.NodeType.ACTIONS] // Only adds kismet actions
    })

await classParser.createCustomNodeFiles()
```

To add exports grouped by class package, generate json file of all classes and more, the `classParser#setExportOptions` method can be used.

## Import classes

Then you can use the classes in your project:

```ts
import { Actions, Events } from './export/index.js'

const myAction = new Actions.MyAction()

console.log(myAction) // prints the kismet text for the 'MyAction' action
```

## Outputs

Besides the generated classes for Typescript, more options can be exported:

- Blender kismet addon script
- JSON file with all the selected nodes
- JSON file of non-kismet classes

### JSON node structure

```json
{
    "name": "WaitforLevelstobevisible",
    "Class": "SeqAct_WaitForLevelsVisible",
    "Package": "Engine",
    "variables": [
        {
            "flags": "",
            "name": "LevelNames",
            "type": "array<name>",
            "replicated": "False"
        },
        {
            "flags": "",
            "name": "bShouldBlockOnLoad",
            "type": "bool",
            "replicated": "False"
        }
    ],
    "category": "\"Engine\"",
    "type": "actions",
    "archetype": "\"SeqAct_WaitForLevelsVisible'Engine.Default__SeqAct_WaitForLevelsVisible'\"",
    "displayName": "\"Wait for Levels to be visible\"",
    "defaultproperties": [
        {
            "name": "bShouldBlockOnLoad",
            "value": "true"
        }
    ],
    "links": {
        "input": [
            {
                "name": "\"Wait\""
            }
        ],
        "output": [
            {
                "name": "\"Finished\""
            }
        ],
        "variable": []
    }
}
```

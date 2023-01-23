---
title: Local Classes
---

# Adding local classes

> Note: This is only needed once (or when classes are updated) if you need more nodes than the available variables in `@kismet.ts/items`

Since every setup of UDK is different, you will get a better experience by cloning the kismet classes to use it in a project.

- `Items` will hold the latest Rocket League compatible nodes
- `Items.Variables` will hold the default UDK variables

If your use case is specified here, you do not need to add your local classes and can use the provided items.

## Steps

1. Read the class files in `/Development/Src/` and create class files. [See the Local extraction page](extract.md) for more details
2. Import classes

## Step 2: Import classes

After creating your classes you can use the classes in your project:

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

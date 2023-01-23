---
title: Local extraction
---

# Local Classes 

There are two methods you can use to extract the classes and create your own definitions:

- [create a JSON file](#method-1-extract-json) and use the built-in methods for the structure.
- read the classes using the `fs` module and [parse the file content to class file](#method-2-manual-parsing)

## Method 1: Extract JSON

To generate the classes, a JSON file is used to hold all information about available connections, names, etc.
You can generate [the JSON structure](schema.md), for example using [Unreal Library](https://github.com/Martinii89/Unreal-Library), to fill in the details of your own nodes. This file can also be used when you want to generate other file outputs than the JSON file.

### Installation

```sh
npm install @kismet.ts/parser-node
```

### JSON file location

Each JSON file needs to be in the same relative position with the same file name as its original unreal class file.
Example:

```txt
/Development/Src/MyMod/MyAction.uc

-> becomes:

/<import_path>/MyMod/MyAction.json
```

Where `<import_path>` is the new folder where all JSON files are placed.

### Generating classes

This file can be separate from your main program and thus can be in any file location.

```ts
import { LocalClassesParser } from '@kismet.ts/parsers-node'

const paths = {
    importPath: "C:\\IMPORT_PATH",
    exportPath: "./export/"
}

const classParser = new LocalClassesParser(paths)
    .setClassPackages(['Engine']) // Only adds kismet classes from these packages
    .setExportOptions({
        blender: true,
        types: ['actions'] // Only adds kismet actions
    })

await classParser.createLocalClasses()
```

To add exports grouped by class package, generate json file of all classes and more, the `classParser#setExportOptions` method can be used.

## Method 2: Manual parsing

While this method allows more control, it is also more work than generating it using the method above.

### Installation

```sh
npm install @kismet.ts/parser-node @kismet.ts/parsers
```

### Reading files

Firstly, the files will need to be converted to item classes.

```ts
// folder: the path to /Development/Src/MyMod
// folderName: MyMod
// filePath: the path to /Development/Src/MyMod/SeqAct_MyAction.uc

import { TextNodeParser } from '@kismet.ts/parsers'
import { createDefaultArchetype, createClassFile } from '@kismet.ts./parsers-node'

for (const fileName of readDirSync(folder)) {
    const archetype = createDefaultArchetype({ 
        Class: fileName.split('.')[0], 
        Package: folderName 
    })
    const content = readFileSync(filePath, { encoding: 'utf8' })

    const parsedFile = TextNodeParser.parseNodeClassFile(fileName, archetype, content)
    if (!parsedFile || !parsedFile.type) throw new Error('No item found...')

    // ... write class
}
```

If a valid item is constructed, then write the class to your export folder.

```ts
const classFileContent = createClassFile(parsedFile.item, {
    ...parsedFile,
    category: 'MyCategory'
})

if (classFileContent) writeFileSync('/export_path/{folderName}/{MyAction}.ts', classFileContent)
```

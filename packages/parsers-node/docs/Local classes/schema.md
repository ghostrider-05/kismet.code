---
title: Item schema
---

# JSON Schema

The schema for any item can be defined with the `$schema` property:

```json
{
    "$schema": "TODO: publish schema",
    // Rest of the item
}
```

## Example definition

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

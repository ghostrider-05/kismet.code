---
title: Raw data
---

# Kismet data

Each kismet node has raw data exposed on `BaseSequenceItem.rawData`.

| Key                | Description                                                                         |
| ------------------ | ----------------------------------------------------------------------------------- |
| ObjInstanceVersion | The version of the node                                                             |
| ObjectArchetype    | The archetype of the kismet node. Is equal to `{Class}'{Package}_Default__{Class}'` |
| ObjPosX            | The relative x location from the point of pasting                                   |
| ObjPosY            | The relative y location from the point of pasting                                   |

## Draw dimensions

When copying a node you will see the `DrawHeight` or `DrawWidth` properties on the node.
This will be the size that the kismet window will draw the node.
If no dimensions are given, they will be added when the node is added to the sequence.

## Connections

Each node has connections defined in the `defaultproperties` in the UnrealScript class. 

!["Modified default properties"](https://cdn.discordapp.com/attachments/711884609981251584/918624367737466920/unknown.png)

As you can see in the image above, you can change the class if the class is not complete.
However, **adding custom connections will not work unless the `Activated` function will trigger that link**.

Some useful properties on a connection are:

| Key           | Description                                                 | Only on variable connections? |
| ------------- | ----------------------------------------------------------- | ----------------------------- |
| LinkDesc      | The name of the link                                        | no                            |
| ActivateDelay | A delay when this output connection is activated            | no                            |
| DrawY / DrawX | The X/Y position for drawing the connection. -- @James      | no / yes                      |
| bWriteable    | Whether the connection is output (triangle shape)           | yes                           |
| bHidden       | Whether to hide the connection                              | no                            |
| MaxVars       | The amount of variables that can be connected (default 255) | yes                           |

## Duplicate keys

If a node has duplicate keys, kismet will only use the first key.

```txt
Begin Object Class=SeqAct_DrawText Name=SeqAct_DrawText_0
   DisplayTimeSeconds=2.000000
   DisplayTimeSeconds=4.000000
...
   Name="SeqAct_DrawText_0"
   ObjectArchetype=SeqAct_DrawText'Engine.Default__SeqAct_DrawText'
End Object
```

So for the `SeqAct_DrawText_0` node, `DisplayTimeSeconds` will be set to `2.000000`.

## Name

As in the example above, each node has a name in the form of `{Class}_\d+`.
The last number is a counter which will be increased every time a node of that specific class is added to the sequence.
If a node is deleted that number will not be occupied again.


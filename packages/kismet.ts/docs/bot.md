---
title: Discord bot
---

# Discord bot

This is a small guide on how to use the `/guide kismet` discord command.

## Node autocomplete

By default, the autocomplete will suggest kismet nodes classes. Click on a class to get the kismet text for that class.

## Player autocomplete

To get autocomplete, begin with `Player().` and then type the property you then need. It will autocomplete and embed more information about the property

### Get property

You can pass options into the variable object:

```txt
Player(bAllPlayers=False)
Player(bAllPlayers=False,playerIdx=2)
Object(varName=MyObject)
```

Then you can get the properties by joining them with a `.`:

```txt
Object().Random.Random2.Random3
```

## Sequence

Create a sequence of any nodes from text:

```txt
LevelLoaded:(Loaded and Visible, In) -> CompareInt(ValueA=0, ValueB=1):(A < B, Show) -> SeqAct_DrawText(String="hello world")
```

The separator is `->`. The format for an item is:

```txt
<name or class>(variable=value, var2=value2):(outputName, inputName)
or:
<name or class>:(outputName, inputName)
or:
<name or class>(variable=value, var2=value2)
or:
<name or class>
```

For more details on multiline input check out [the sequence parsers guide](/parsers/text/sequence).

## Errors

If the query results in an error, the bot will try to format an error.
The error will be reported, but you can always open an issue to get it fixed.

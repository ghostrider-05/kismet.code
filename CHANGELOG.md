# Changelog

All notable changes to this project will be documented in this file.

## 1.0.0-beta.2

- `<Class>#toKismet` is now deprecated on all classes in favour of `<Class>#toString`
- `KismetFile.classParser` is now deprecated

### Bug fixes

- **BaseItem**: correctly return `isSequenceItem` when no type is defined
- **BaseSequenceItem**: fix error when no connection links were provided
- **BaseSequenceItem**: when a sequence constructor is used, add the item to the sequence
- **SequenceCondition**: set type to condition
- types: `SequenceItemType` includes BaseItem
- license: remove license extension

### Features

- tests: add tests
- export `Constants` (with `DefaultSequenceViewOptions`)
- export `Parsers`
- **Sequence**: add `project` id
- **Sequence**: `overwriteSequence` option in `addItem`
- **SequenceVariable**: validate (number) inputs
- **SequenceAction**: throw error on unknown connection in `addConnection`
- **BaseItem**: add `addToSequence` option to `setSequence`
- **KismetFile**: option to show debug information
- **KismetFile**: `copy` item to the clipboard
- **KismetFile**: add `listItems` method
- **Util**: add `clipboard`

### Breaking changes

- **Sequence**: removed `find` method in favour of the new `resolveId`
- **Sequence**: `addSubsequence` returns both the sequence and the new subsequence
- **BaseSequenceItem**: `sequence` is now only the id of the linked sequence

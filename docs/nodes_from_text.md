# Kismet nodes from text

## Input: node(s)

Valid inputs are:

- (friendly) class name of the kismet node
- property chains (see example)
- copied kismet node

Example:

```ts
import { KismetFile } from 'kismet.code'

const text = new KismetFile({ projectName: 'Untitled' }).textParser

// Name of (friendly) class
console.log(text.node('SeqAct_DrawText')?.toKismet())

// Kismet node
console.log(text.node(`
Begin ...
End
`))

// Chain of get properties
const properties = 'Player().PRI.teamInfo.teamIndex' 
// Also possible: PRI.teamInfo.teamIndex (assumes Player(allPlayers=True) as target object)
console.log(text.node(properties)?.map(node => node.toKismet()))
```

## Input: sequence

A sequence can be created from multiple nodes by connecting them with one of the following characters:

- '>'
- '->'

Then the template for a node would be:

```txt
MyClass(myProp=0, secondProp="Hello world"):(<output_name>)
```

Note that the output name is not required if the only output name is `Out`:

```ts
AnotherClass(myProp=True) 
// or:
AnotherClass(myProp=True):()
// or when no variables are used:
AnotherClass():() 
// Also valid:
AnotherClass()
AnotherClass
```

And when only an output name is needed, the following inputs are valid:

```txt
AnotherClass():(<output_name>)
AnotherClass:(<output_name>)
```

Example:

```ts
import { KismetFile } from 'kismet.code'

const text = new KismetFile({ projectName: 'Untitled' }).textParser

const sequence = 'LevelLoaded:(visible) > CompareInt(0, 1):(A < B) > SeqAct_DrawText(String="hello world", Targets=Player(allPlayers=True))'

console.log(text.sequence(sequence)?.toKismet())
```

### Subsequence

To create a subsequence add `Sequence(mySequenceName):` before the sequence input

## Unknown input

When it is unknown whether the input is a sequence or node:

```ts
import { KismetFile } from 'kismet.code'

const text = new KismetFile({ projectName: 'Untitled' }).textParser

const input = 'your unknown input'

if (text.isInvalidInput(input)) {
    // no parsing is needed as the input is not valid
}

try {
    if (text.isSequenceText(input)) {
        // input is a sequence 
        return text.sequence(input)
    } else {
        // input is a node
        return text.node(input)
    }
} catch (err) {
    // Handle errors 
    console.error(err)
}
```

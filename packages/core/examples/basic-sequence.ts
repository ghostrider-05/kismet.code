import { Sequence, SequenceAction } from '../src/index.js'

const sequence = new Sequence({
    mainSequence: true
})

// Replace this with your own actions
const action = new SequenceAction({
    ObjectArchetype: 'SeqAct_MyAction\'Package.Default__SeqAct_MyAction\'',
    inputs: {}
})

const output = sequence
    .addItem(action)
    .toString()

console.log(output)

// Generates kismet code for Advent of Code 2021, day 1 part 1

import { readFile } from 'fs/promises'
import { KismetFile } from '../../src/dist/src/index.js'

const { 
    Events: { LevelLoaded }, 
    Conditions: { CompareInt }, 
    Actions: { Int, AddInt, DrawText, ConvertToString }
} = KismetFile.Items

const { Integer, Player, String } =  KismetFile.Items.Variables

const file = new KismetFile({ projectName: 'AoC2021' })

const input = (await readFile('input.txt', { encoding: 'utf8' })).split('\r\n').map(n => {
    return new Integer().setValue(Number(n))
})

const length = new Integer().setName('length')
const one = new Integer().setName('one').setValue(1)

file.mainSequence.addItems([...input, length, one])

let lastCompare = null, lastAdd = null

for (let i = 1; i < input.length; i++) {   
    const int = input[i]
    const intmin1 = input[i - 1]
    const emptyInt = new Integer()

    const addLength = new Int()
        .setVariable('Value', emptyInt)
        .setVariable('Target', length)

    const addInt = new AddInt()
        .setVariable('A', one)
        .setVariable('B', length)
        .setVariable('IntResult', emptyInt)
        .addConnection(addLength, 'Out', 'In')

    const compare = new CompareInt()
        .setVariable('A', intmin1)
        .setVariable('B', int)
        .addOutputConnection({ name: 'A < B'} , { name: 'In', item: addInt })
        
    file.mainSequence.addItems([emptyInt, compare, addInt, addLength])

    if (i === 1) {
        const onLoaded = new LevelLoaded().on({
            name: 'Loaded and Visible',
            item: compare
        })

        file.mainSequence.addItem(onLoaded)
    } else if (i + 1 <= input.length) {
        lastAdd?.addConnection(compare, 'Out', 'In');

        lastCompare?.addConnection(compare, 'A == B', 'In')
            .addConnection(compare, 'A > B', 'In')
    } 

    lastCompare = compare
    lastAdd = addLength
        
    if (i + 1 === input.length){
        const players = new Player()
            .setAllPlayer(true)
            
        const string = new String()

        const draw = new DrawText()
            .setVariable('Target', players)
            .setVariable('String', string, false);

        draw.getConnection('variable', 'String')?.setHidden(false);

        const convertedString = new ConvertToString()
            .setVariable('Inputs', length)
            .setVariable('Output', string)
            .addConnection(draw, 'Out', 'Show')

        file.mainSequence.addItems([players, string, draw, convertedString])

        compare.addConnection(convertedString, 'A == B', 'In')
            .addConnection(convertedString, 'A > B', 'In')

        addLength.addConnection(convertedString, 'Out', 'In')
    }
}

await file.copyKismet()
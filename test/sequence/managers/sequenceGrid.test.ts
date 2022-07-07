import { Util, KismetFile } from '../../../src/index.js'

import { builders } from '../../../src/structures/builders/index.js'

const { sequenceBuilder } = builders

describe('sequence grid manager', () => {
    test('default grid', () => {
        const grid = new Util.SequenceGrid()
        const item = new KismetFile.Items.Actions.AddGameBall().setPosition({
            x: 341,
            y: 983,
        })

        const sequence = sequenceBuilder().addItem(item)

        expect(
            grid.setGrid({ x: 100, y: 100 }).applyGridToSequence(sequence)
        ).toBe(sequence.updateItem(item, item.setPosition({ x: 300, y: 900 })))
    })
})

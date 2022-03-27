import { Constants } from '../../src/index.js'
import { builders } from '../../src/structures/builders/index'

const { nodeBuilder, sequenceBuilder } = builders

const name = 'test_sequence'

describe('item sequence', () => {
    test('sequence name', () => {
        expect(sequenceBuilder().name).toBe('Sub_Sequence')
        expect(sequenceBuilder({ name }).name).toBe(name)
        expect(sequenceBuilder().setName(name).name).toBe(name)
    })

    test('sequence disabled', () => {
        expect(sequenceBuilder().enabled).toBe(true)
        expect(sequenceBuilder().setDisabled().enabled).toBe(false)
    })

    test('sequence default view', () => {
        const sequenceView = { x: 100, y: 100, zoom: 1 }

        expect(sequenceBuilder().defaultView).toEqual(
            Constants.DefaultSequenceViewOptions
        )
        expect(
            sequenceBuilder({
                defaultView: sequenceView
            }).defaultView
        ).toEqual(sequenceView)

        expect(
            sequenceBuilder().setView({ x: 100, y: 100 }).defaultView
        ).toEqual(sequenceView)
    })

    test('sequence add item', () => {
        const item = nodeBuilder(),
            sequence = sequenceBuilder()

        const itemSequence = (item: typeof sequence.items[number]) => {
            return 'sequence' in item ? item.sequence : undefined
        }

        expect(
            itemSequence(sequenceBuilder().addItem(item, false).items[0])
        ).toBe(item.sequence)
        expect(itemSequence(sequenceBuilder().addItem(item).items[0])).toBe(
            sequence.linkId
        )
    })

    test('sequence add items', () => {
        const items = [nodeBuilder(), nodeBuilder(), nodeBuilder()]

        expect(sequenceBuilder().addItems(items).items.length).toBe(3)
    })

    test('add subsequence', () => {
        const seq = sequenceBuilder().addSubSequence({ name }).sequence

        expect(seq.subSequences[0]).toBeDefined()
        expect(seq.items[0]).toBeDefined()
    })

    test('sequence find item', () => {
        const item = nodeBuilder()
        expect(sequenceBuilder().addItem(item).resolveId(item.id)?.linkId).toEqual(item.linkId)
        expect(sequenceBuilder().addItem(item).resolveId(item.linkId)?.linkId).toEqual(item.linkId)
    })

    test('sequence string', () => {
        const seq = sequenceBuilder()
        /** @deprecated */
        expect(seq.toKismet()).toEqual(seq.toString())
    })
})

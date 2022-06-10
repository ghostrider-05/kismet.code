import { Structures, Constants } from '../../src/index.js'

import { builders } from '../../src/structures/builders/index.js'

const {
    baseBuilderArchetype,
    baseBuilderData,
    actionBuilder,
    conditionBuilder,
    eventBuilder,
    sequenceBuilder,
    variableBuilder,
} = builders

// TODO: improve string / JSON tests

describe('Sequence item', () => {
    test('base item type guards', () => {
        const baseItem = new Structures.Base()
        const baseAction = new Structures.Base(Constants.NodeType.ACTIONS)
        const baseCondition = new Structures.Base(Constants.NodeType.CONDITIONS)
        const baseEvent = new Structures.Base(Constants.NodeType.EVENTS)
        const baseSequence = new Structures.Base(Constants.NodeType.SEQUENCES)
        const baseVariable = new Structures.Base(Constants.NodeType.VARIABLES)

        expect(baseItem.isAction()).toEqual(false)
        expect(baseItem.isSequenceItem()).toEqual(false)
        expect(baseItem.isSequenceNode()).toEqual(false)
        expect(baseItem.isCondition()).toEqual(false)
        expect(baseItem.isEvent()).toEqual(false)
        expect(baseItem.isSequence()).toEqual(false)
        expect(baseItem.isVariable()).toEqual(false)

        expect(baseAction.isAction()).toEqual(true)
        expect(baseAction.isSequenceItem()).toEqual(true)
        expect(baseAction.isSequenceNode()).toEqual(true)
        expect(baseAction.isCondition()).toEqual(false)
        expect(baseAction.isEvent()).toEqual(false)
        expect(baseAction.isSequence()).toEqual(false)
        expect(baseAction.isVariable()).toEqual(false)

        expect(baseCondition.isAction()).toEqual(false)
        expect(baseCondition.isSequenceItem()).toEqual(true)
        expect(baseCondition.isSequenceNode()).toEqual(true)
        expect(baseCondition.isCondition()).toEqual(true)
        expect(baseCondition.isEvent()).toEqual(false)
        expect(baseCondition.isSequence()).toEqual(false)
        expect(baseCondition.isVariable()).toEqual(false)

        expect(baseEvent.isAction()).toEqual(false)
        expect(baseEvent.isSequenceItem()).toEqual(true)
        expect(baseEvent.isSequenceNode()).toEqual(false)
        expect(baseEvent.isCondition()).toEqual(false)
        expect(baseEvent.isEvent()).toEqual(true)
        expect(baseEvent.isSequence()).toEqual(false)
        expect(baseEvent.isVariable()).toEqual(false)

        expect(baseSequence.isAction()).toEqual(false)
        expect(baseSequence.isSequenceItem()).toEqual(false)
        expect(baseSequence.isSequenceNode()).toEqual(false)
        expect(baseSequence.isCondition()).toEqual(false)
        expect(baseSequence.isEvent()).toEqual(false)
        expect(baseSequence.isSequence()).toEqual(true)
        expect(baseSequence.isVariable()).toEqual(false)

        expect(baseVariable.isAction()).toEqual(false)
        expect(baseVariable.isSequenceItem()).toEqual(true)
        expect(baseVariable.isSequenceNode()).toEqual(false)
        expect(baseVariable.isCondition()).toEqual(false)
        expect(baseVariable.isEvent()).toEqual(false)
        expect(baseVariable.isSequence()).toEqual(false)
        expect(baseVariable.isVariable()).toEqual(true)
    })

    test('item type', () => {
        const baseItem = new Structures.Base()

        expect(baseItem.type).toBeNull()

        expect(actionBuilder().type).toBe(Constants.NodeType.ACTIONS)
        expect(conditionBuilder().type).toBe(Constants.NodeType.CONDITIONS)
        expect(eventBuilder().type).toBe(Constants.NodeType.EVENTS)
        expect(sequenceBuilder().type).toBe(Constants.NodeType.SEQUENCES)
        expect(variableBuilder().type).toBe(Constants.NodeType.VARIABLES)
    })

    describe('item kismet data', () => {
        const action = actionBuilder()
        const defaultKismetData = {
            ObjPosX: 0,
            ObjPosY: 0,
            DrawWidth: 0,
            DrawHeight: null,
            MaxWidth: null,
            ObjInstanceVersion: 1,
            ObjectArchetype: baseBuilderArchetype,
            ParentSequence: Constants.MAIN_SEQUENCE,
            Name: action.toJSON().Name,
        }

        test('default kismet data', () => {
            expect(action.toJSON()).toEqual(defaultKismetData)
        })

        test('item position', () => {
            const newPosition = {
                x: 500,
                y: 500,
            }
            const positionAction = actionBuilder().setPosition(newPosition)
            const { ObjPosX: x, ObjPosY: y } = positionAction.toJSON()

            expect(newPosition).toEqual({
                x,
                y,
            })
        })

        test('item comment', () => {
            expect(actionBuilder().commentOptions.comment).toBeUndefined()
            expect(
                actionBuilder().commentOptions.outputCommentToScreen
            ).toBeUndefined()
            expect(
                actionBuilder().commentOptions.supressAutoComment
            ).toBeUndefined()

            expect(
                actionBuilder().setComment({ comment: 'Test' }).commentOptions
                    .comment
            ).toEqual('Test')
            expect(
                actionBuilder().setComment({ outputCommentToScreen: true })
                    .commentOptions.outputCommentToScreen
            ).toBe(true)
            expect(
                actionBuilder().setComment({ supressAutoComment: false })
                    .commentOptions.supressAutoComment
            ).toBe(false)
        })

        test('item equality', () => {
            const equalAction = actionBuilder(),
                equalEvent = eventBuilder({
                    ObjectArchetype: baseBuilderArchetype.replace(
                        'Archetype',
                        'Archetype2'
                    ),
                })

            expect(equalAction.equals(equalEvent)).toBe(false)
            expect(equalAction.equals(equalAction)).toBe(true)
        })

        test('item linkid', () => {
            const linkAction = actionBuilder()
            const linkId = `${baseBuilderData.Class}'${(
                linkAction.toJSON().Name as string
            )?.replace(/"/g, '')}'`

            expect(linkAction.linkId).toEqual(linkId)
        })

        test('item sequence', () => {
            expect(actionBuilder().sequence).toEqual(Constants.MAIN_SEQUENCE)
            const itemSequence = sequenceBuilder({ name: 'test_sequence' })

            expect(
                actionBuilder().setSequence('test_sequence').sequence
            ).toEqual(`Sequence'test_sequence'`)
            expect(actionBuilder().setSequence(itemSequence).sequence).toBe(
                itemSequence.linkId
            )
            expect(
                actionBuilder().setSequence(itemSequence).toJSON()
                    .ParentSequence
            ).toEqual(`Sequence'test_sequence'`)
        })
    })
})

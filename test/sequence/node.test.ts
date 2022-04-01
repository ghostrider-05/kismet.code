/* eslint-disable @typescript-eslint/ban-ts-comment */
import { KismetFile } from '../../src/index.js'
import { builders } from '../../src/structures/builders/index.js'

const {
    actionBuilder,
    conditionBuilder,
    eventBuilder,
    nodeBuilder,
    sequenceBuilder,
    variableBuilder
} = builders

const { Actions, Events } = KismetFile.Items
const { AddGameBall } = Actions
const { MainMenuSwitched } = Events

describe('item node and constructors', () => {
    test('item node breakpoint', () => {
        expect(nodeBuilder().hasBreakpoint).toBe(false)
        expect(nodeBuilder().setBreakPoint(false).hasBreakpoint).toBe(false)
        expect(nodeBuilder().setBreakPoint(true).hasBreakpoint).toBe(true)

        expect(
            nodeBuilder().setBreakPoint(true).toJSON().bIsBreakpointSet
        ).toBe('True')
        expect(nodeBuilder().setBreakPoint(true).toString()).toContain(
            'bIsBreakpointSet'
        )
        expect(nodeBuilder().toString()).not.toContain('bIsBreakpointSet')

        expect(
            new AddGameBall().setVariable('SpawnTransform', 'test').toString()
        ).toContain('SpawnTransform')

        const node = nodeBuilder()
        /** @deprecated */
        expect(node.toKismet()).toEqual(node.toString())
    })
})

describe('sequence action', () => {
    test('action targets', () => {
        expect(actionBuilder().setTargets(['test']).toString()).toContain(
            'Targets(0)=test'
        )
    })

    test('action add connection', () => {
        expect(
            new AddGameBall()
                .addConnection(new AddGameBall(), 'Added', 'Add')
                .toJSON()['OutputLinks(0)']
        ).toMatch(
            /\(OverrideDelta=0,DrawY=0,Links=\(\(LinkedOp=SeqAct_AddGameBall_TA'SeqAct_AddGameBall_TA_\d'\)\)\)/g
        )

        const sequence = sequenceBuilder()
        const addBallAction = new AddGameBall()
            .setSequence(sequence)
            .addConnection(new AddGameBall(), 'Added', 'Add')

        expect(sequence.resolveId(addBallAction.id)).toBe(addBallAction)
    })

    test('action invalid add connection', () => {
        // Invalid output connection
        expect(() =>
            new AddGameBall().addConnection(new AddGameBall(), 'test', 'Add')
        ).toThrowError()

        // Invalid input connection
        expect(() =>
            new AddGameBall().addConnection(new AddGameBall(), 'Added', 'test')
        ).toThrowError()
    })
})

describe('sequence event', () => {
    test('constructor options', () => {
        expect(eventBuilder().trigger.maxCount).toBe(0)
        expect(eventBuilder().trigger.delay).toBe(0.008)

        expect(eventBuilder().enabled).toBe(true)
        expect(eventBuilder().playerOnly).toBe(false)
        expect(eventBuilder().clientSideOnly).toBe(false)

        const optionEvent = eventBuilder({
            maxTriggerCount: 1,
            triggerDelay: 1,
            enabled: false,
            playerOnly: true,
            clientSideOnly: true
        })

        expect(optionEvent.trigger.maxCount).toBe(1)
        expect(optionEvent.trigger.delay).toBe(1)
        expect(optionEvent.enabled).toBe(false)
        expect(optionEvent.playerOnly).toBe(true)
        expect(optionEvent.clientSideOnly).toBe(true)
    })

    test('event disabled', () => {
        expect(eventBuilder().setDisabled().enabled).toBe(false)
    })

    test('event display options', () => {
        expect(eventBuilder().setDisplay({ player: true }).playerOnly).toBe(
            true
        )
        expect(eventBuilder().setDisplay({ client: true }).clientSideOnly).toBe(
            true
        )
    })

    test('event trigger options', () => {
        expect(eventBuilder().setTrigger({ max: 1 }).trigger.maxCount).toBe(1)
        expect(eventBuilder().setTrigger({ delay: 1 }).trigger.delay).toBe(1)
    })

    test('event attach action', () => {
        expect(
            new MainMenuSwitched()
                .on({
                    name: 'Changed',
                    item: actionBuilder()
                })
                .getConnection('output', 'Changed')?.links?.length
        ).toBe(1)

        expect(
            new MainMenuSwitched()
                .on({
                    name: 'Changed',
                    item: actionBuilder()
                })
                .on({
                    name: 'Changed',
                    item: conditionBuilder()
                })
                .getConnection('output', 'Changed')?.links?.length
        ).toBe(2)

        // Invalid connection name
        expect(() =>
            new MainMenuSwitched().on({
                name: 'test',
                item: actionBuilder()
            })
        ).toThrowError()

        // Invalid item
        expect(() =>
            new MainMenuSwitched().on({
                name: 'Changed',
                // @ts-expect-error
                item: variableBuilder()
            })
        ).toThrowError()
    })

    test('event export', () => {
        expect(eventBuilder().toJSON().MaxTriggerCount).toBe(0)
        expect(eventBuilder().toString()).toContain('MaxTriggerCount=0')

        const event = eventBuilder()
        /** @deprecated */
        expect(event.toKismet()).toEqual(event.toString())
    })
})

describe('sequence variable', () => {
    test('', () => {
        expect(variableBuilder().variableName).toBeNull()
        expect(variableBuilder({ name: 'test' }).variableName).toBe('test')
        expect(variableBuilder().setName('test').variableName).toBe('test')

        expect(variableBuilder().toString()).not.toContain('VarName')
        expect(variableBuilder({ name: 'test' }).toString()).toContain(
            'VarName'
        )

        const variable = variableBuilder()
        /** @deprecated */
        expect(variable.toKismet()).toEqual(variable.toString())
    })
})

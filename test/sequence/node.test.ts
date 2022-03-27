import { KismetFile } from '../../src/index.js'
import { builders } from '../../src/structures/builders/index.js'

const { actionBuilder, nodeBuilder, sequenceBuilder, variableBuilder } =
    builders
const { Actions } = KismetFile.Items
const { AddGameBall } = Actions

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

import { KismetFile, Util } from '../src/index.js'
import { ProcessManager } from '../src/structures/index.js'
import { builders } from '../src/structures/builders/index.js'

// Keep old clipboard value from before tests
let clipboardValue = ''

beforeAll(async () => {
    clipboardValue = await Util.clipboard.read()
})

afterAll(async () => await Util.clipboard.write(clipboardValue))

describe('main project', () => {
    const baseProject = new KismetFile({ projectName: 'test' })

    test('constructor options', () => {
        expect(baseProject.projectName).toBe('test')
    })

    test('debug options', () => {
        expect(ProcessManager.processes['test_1']).toBeUndefined()

        new KismetFile({ projectName: 'test_1', debug: true })
        expect(ProcessManager.processes['test_1'].options.debug).toBe(true)
    })

    test('list project items', () => {
        const items = {
            Actions: {
                name: builders.actionBuilder(),
                name2: builders.actionBuilder(),
                name3: builders.actionBuilder(),
                name4: {
                    invalid: builders.actionBuilder(),
                },
            },
            Events: { name: builders.eventBuilder() },
            Conditions: {},
            Variables: {},
        }

        expect(KismetFile.listItems(items)).toEqual([
            ...Object.keys(items.Actions)
                .map(key =>
                    key !== 'name4' ? items.Actions[<never>key] : undefined
                )
                .filter(n => n),
            ...Object.keys(items.Events).map(key => items.Events[<never>key]),
        ])
    })

    test('project export options', () => {
        expect(baseProject.toString()).toEqual('')

        const action = builders.actionBuilder()
        baseProject.mainSequence.addItem(action)

        expect(baseProject.toString()).toEqual(action.toString())
    })

    test('item copy to clipboard', async () => {
        const action = builders.actionBuilder()

        return KismetFile.copy(action).then(async () => {
            return Util.clipboard.read().then(content => {
                expect(content).toEqual(action.toString())
            })
        })
    })

    test('project copy to clipboard', async () => {
        return baseProject.copyKismet().then(async () => {
            return Util.clipboard.read().then(content => {
                expect(content).toEqual(baseProject.toString())
            })
        })
    })
})

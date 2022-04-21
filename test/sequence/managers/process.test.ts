import { ProcessManager, ProcessId } from '../../../src/structures/index.js'

describe('process manager', () => {
    test('create and resolve ids', () => {
        const id = ProcessId.readResolvedId(
            ProcessManager.id('test_process').resolveId()
        ).name

        expect(new ProcessId(id)['id']).toEqual('test_process')
        expect(ProcessManager['ids'].get('test_process')).toBe(1)
    })

    test('compare ids', () => {
        const id = ProcessManager.id('test_process'),
            compareId = ProcessManager.id('test_process_2'),
            sameId = ProcessManager.id('test_process')

        expect(id.equalIds(sameId)).toBe(false)
        expect(id.equalIds(compareId)).toBe(false)

        expect(id.equals(sameId.resolveId())).toBe(false)
        expect(id.equals(compareId.resolveId())).toBe(false)

        expect(ProcessId.equalIds(id, sameId)).toBe(false)
        expect(ProcessId.equalIds(id, compareId)).toBe(false)
    })

    test('overwritten ids', () => {
        const id = ProcessManager.id('test_process_3')
        const { count } = ProcessId.readResolvedId(id.resolveId())

        expect(() =>
            ProcessManager.id('test_process_3', { index: count + 1 })
        ).not.toThrowError()
        expect(() =>
            ProcessManager.id('test_process_3', { index: count })
        ).toThrowError()
    })

    test('debug', () => {
        // No project found
        expect(ProcessManager.debug('test')).toBeUndefined()

        const id = ProcessManager.attachProject('test_process_4', {
            debug: true
        })
        expect(ProcessManager.processes['test_process_4']).toBeTruthy()

        // duplicate process name
        expect(() =>
            ProcessManager.attachProject('test_process_4')
        ).toThrowError()

        // project options
        ProcessManager.attachProject('test_process_5')
        expect(ProcessManager.processes['test_process_4'].options).toEqual({
            debug: true
        })
        expect(ProcessManager.processes['test_process_5'].options).toEqual({})

        // debug

        // Debugs using the first project
        expect(ProcessManager.debug('test')).not.toBeUndefined()
        expect(() => ProcessManager.debug('test')).not.toThrowError()
        expect(ProcessManager.debug('test', id)?.content).toBe(
            '[test_process_4] test'
        )

        expect(ProcessManager.debug('test', id)?.completed).toBe(true)
        expect(() => ProcessManager.debug('test', id)).not.toThrowError()
    })
})

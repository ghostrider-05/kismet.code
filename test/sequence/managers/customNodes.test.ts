/* eslint-disable @typescript-eslint/ban-ts-comment */
import { resolve } from 'path'
import { Parsers, Constants } from '../../../src/index.js'

const { Classes } = Parsers

describe('custom node manager', () => {
    test('custom nodes check', () => {
        // Invalid export path
        Classes.exportPath = null
        expect(Classes.hasCustomNodeFiles()).toBe(false)

        // Invalid import path
        Classes.importPath = null
        Classes.exportPath = './'
        expect(Classes.hasCustomNodeFiles()).toBe(false)
    })

    test('debug options', () => {
        expect(Classes.options.debug).toBeUndefined()

        expect(Classes.setDebugOptions(true).options.debug).toBe(true)
        expect(Classes.setDebugOptions(false).options.debug).toBe(false)
    })

    test('set export options', () => {
        Classes.setExportOptions()
        expect(
            Classes.setExportOptions(Constants.defaultClassParserOptions)
                .options
        ).toEqual(Constants.defaultClassParserOptions)

        // overwrite options
        expect(
            Classes.setExportOptions({ debug: true }).setExportOptions({
                debug: false,
                json: true,
            }).options.debug
        ).toBe(false)
        expect(
            Classes.setExportOptions({ json: true }).setExportOptions(undefined)
                .options.json
        ).toBeUndefined()
    })

    test('set export packages', () => {
        expect(Classes.setClassPackages(['Engine']).packages).toEqual([
            'Engine',
        ])
    })

    test('create nodes', async () => {
        //@ts-expect-error
        Classes.setExportOptions(undefined).setImportPath(null)

        return Classes.setDebugOptions(true)
            .createCustomNodeFiles()
            .then(() => expect(true).toBe(false))
            .catch(() => expect(true).toBe(true))
    })

    test('set blender addon options', () => {
        expect(Classes.setBlenderOptions({}).options.blender).toBe(true)
        expect(
            Classes.setBlenderOptions({ copy: true }).options.blenderOptions
        ).toEqual({ copy: true })
    })

    describe('set path options', () => {
        test('import path', () => {
            expect(() =>
                Classes.setImportPath('./invalid_path/')
            ).not.toThrowError()
            expect(() =>
                Classes.setImportPath('./invalid_path/', { check: true })
            ).toThrowError()

            // relative path
            expect(() =>
                Classes.setImportPath('../managers/', { check: true })
            ).toThrowError()
        })

        test('export path', () => {
            expect(() =>
                Classes.setExportPath('./invalid_path/')
            ).not.toThrowError()
            expect(() =>
                Classes.setExportPath('./invalid_path/', { check: true })
            ).toThrowError()

            expect(Classes.setExportPath('../managers/').exportPath).toBe(
                resolve('.', '../managers/')
            )
        })
    })

    test('log', () => {
        // Internal??
        expect(() =>
            Classes.setDebugOptions(true)['log']('', { error: true })
        ).toThrowError()
    })
})

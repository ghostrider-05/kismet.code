import { readFileSync } from 'fs'
import { resolve } from 'path'

import { catchTest, JSONnode } from '../../src/structures/builders/index.js'

import { findClasses } from '../../src/parser/find.js'
import {
    catchFileWriteError,
    getExportFile,
    writeFile
} from '../../src/parser/utils/files.js'

import { _debug } from '../../src/parser/utils/options.js'
import {
    _validateNodeInput,
    _validatePackage
} from '../../src/parser/utils/validate.js'

import type { JsonFile } from '../../src/types/index.js'

describe('class parser', () => {
    test('invalid paths input', async () => {
        return findClasses({ importPath: '', exportPath: '' }).then(result =>
            expect(result).toBeUndefined()
        )
    })

    test('write file', async () => {
        return await writeFile(
            resolve('.', './src/dist/src/test/text.txt'),
            'test'
        )
    })

    test('debug logging', () => {
        expect(() => _debug(false)('test', { error: true })).not.toThrowError()
        expect(() => _debug(true)('test', { error: true })).toThrowError()
    })

    describe('class parser utils', () => {
        test('catch an error if file not found', async () => {
            catchTest(
                () =>
                    catchFileWriteError(async () => {
                        readFileSync('./invalid_path', { encoding: 'utf8' })
                        return
                    }),
                false
            )

            catchTest(() =>
                catchFileWriteError(() => {
                    throw new Error('Not a file write error...')
                })
            )

            const promise = async (): Promise<void> => {
                return await (async function () {
                    return
                })()
            }

            catchTest(() => catchFileWriteError(promise), false)
            return catchFileWriteError(promise).then(() => {
                expect(true).toBeTruthy()
            })
        })

        test('validate node input', () => {
            expect(() => _validateNodeInput({ name: 0 })).toThrowError()
            expect(_validateNodeInput(JSONnode)).toBe(true)
        })

        test('validate package input', () => {
            expect(
                _validatePackage('Engine', { importPath: './' }, false)
            ).toBeNull()
        })

        test('parser export statements', () => {
            const Class: JsonFile = {
                name: 'Class',
                Package: 'Engine',
                type: 'actions',
                category: 'Test'
            }

            expect(getExportFile([], false)).toBe('')

            expect(getExportFile([Class], false)).not.toContain(
                'export const Engine'
            )
            expect(getExportFile([Class], true)).toContain(
                'export const Engine'
            )
        })

        // test('invalid item provided for ClassManager', () => {
        //     const manager = new ClassManager()

        //     manager.readPackage({ 'Engine', {}})
        // })
    })
})

/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    parseVar,
    boolToKismet,
    Constants,
    groupByProperty,
    stringFirstCharUppercase,
    isType,
    filterEmptyLines
} from '../src/shared/index.js'

describe('shared', () => {
    test('kismet variable parsing', () => {
        const _ = (value: string) => Constants.KISMET_LINE_INDENT + value

        expect(parseVar('test', 0)).toEqual(_('test=0'))
        expect(parseVar('test', 'hello')).toEqual(_('test=hello'))
        expect(parseVar('test', null)).toEqual('')
        expect(parseVar('test', true)).toEqual(_('test=True'))

        expect(boolToKismet(null)).toEqual('False')
        expect(boolToKismet(false)).toEqual('False')
        expect(boolToKismet(true)).toEqual('True')
    })

    test('string pascalcase', () => {
        //@ts-expect-error
        expect(stringFirstCharUppercase(undefined)).toBeNull()

        expect(stringFirstCharUppercase('test')).toEqual('Test')
    })

    test('filter empty lines', () => {
        expect(filterEmptyLines('test')).toEqual('test')
        expect(filterEmptyLines('test\ntest\n\ntest')).toEqual(
            'test\ntest\ntest'
        )
        expect(filterEmptyLines(['test', 'test', '', 'test'])).toEqual(
            'test\ntest\ntest'
        )
    })

    test('group by property', () => {
        expect(
            groupByProperty(
                [
                    { a: 'Package1', b: 3 },
                    { a: 'Package1', b: 6 },
                    { a: 'Package2', b: 0 }
                ],
                'a'
            )
        ).toStrictEqual([
            [
                { a: 'Package1', b: 3 },
                { a: 'Package1', b: 6 }
            ],
            [{ a: 'Package2', b: 0 }]
        ])
    })

    test('input type validation', () => {
        expect(isType('string', undefined)).toBe(true)
        expect(isType('number', 1)).toBe(true)
        expect(isType('string', 'test')).toBe(true)
        expect(isType('array', ['test'])).toBe(true)
        expect(isType('array', [])).toBe(true)
        expect(isType('object', { a: 'test' })).toBe(true)

        //@ts-expect-error
        expect(isType('test', 'test')).toBe(true)

        expect(isType('array', [{ a: 'test' }], ['a'])).toBe(true)
        expect(isType('object', { a: 'test' }, ['a'])).toBe(true)

        expect(() => isType('string', 1)).toThrowError()
        expect(() => isType('number', 'test')).toThrowError()
        expect(() => isType('object', 'test')).toThrowError()
        expect(() => isType('array', 'test')).toThrowError()

        expect(() => isType('array', [{ a: 'test' }], ['b'])).toThrowError()
        expect(() => isType('object', { a: 'test' }, ['b'])).toThrowError()
    })
})

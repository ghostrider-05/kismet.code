/* eslint-disable @typescript-eslint/ban-ts-comment */
import { KismetError } from '../src/shared/index.js'

test('kismet error', () => {
    //@ts-expect-error
    expect(() => new KismetError('INVALID_TEST_KEY')).toThrowError()
    expect(
        () => new KismetError('SEQUENCE_EMPTY', ['test_sequence'])
    ).toThrowError()
    expect(() => new KismetError('INVALID_COLORS_INPUT')).toThrowError()

    expect(
        () =>
            new KismetError('SEQUENCE_EMPTY', ['test_sequence'], {
                error: false
            })
    ).not.toThrowError()

    expect(
        () =>
            new KismetError('FLOAT_INPUT', undefined, {
                cause: new Error(),
                data: { origin: 'test' }
            })
    ).toThrowError()
})

test('kismet error messages', () => {
    const { Messages } = KismetError

    expect(<string>Messages['INVALID_COLORS_INPUT']).toBeDefined()
    //@ts-ignore
    expect(Messages['SEQUENCE_EMPTY']('test_sequence')).toContain(
        'test_sequence'
    )

    Object.keys(Messages).forEach(key => {
        const message = Messages[key as keyof typeof Messages]

        expect(
            // @ts-ignore
            typeof message === 'string' ? message : message(...[])
        ).toBeTruthy()
    })
})

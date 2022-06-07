/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Util } from '../../src/index.js'

const baseColor = new Util.Color()

describe('Kismet color util', () => {
    const baseValues = {
        R: 1,
        G: 2,
        B: 3,
        A: 255,
    }
    const baseColorOptions = <[number, number, number, number]>(
        Object.values(baseValues)
    )

    test('constructor options', () => {
        const { R, G, B, A } = new Util.Color(baseValues)

        expect({ R, G, B, A }).toEqual(baseValues)

        expect(new Util.Color().R).toBe(0)
        expect(new Util.Color().A).toBe(255)
    })

    test('number validation', () => {
        expect(() => baseColor.setColor('R', 143)).not.toThrow()
        expect(() => baseColor.setColor('G', -1)).toThrow()
        expect(() => baseColor.setColor('B', 256)).toThrow()

        // @ts-expect-error
        expect(() => baseColor.setColor('R', 'false')).toThrow()

        baseColor.R = 256
        expect(() => baseColor.toString()).toThrow()

        expect(() => baseColor.setColors([255, 143, 143, -20])).toThrow()
        // @ts-expect-error
        expect(() => baseColor.setColors([255, 143, 20])).toThrow()
    })

    test('color methods', () => {
        expect(baseColor.setColor('R', 143).R).toBe(143)

        const { R, G, B, A } = baseColor.setColors(baseColorOptions)
        expect({ R, G, B, A }).toEqual(baseValues)
    })

    test('color in string formatted', () => {
        expect(new Util.Color(baseValues).toString()).toEqual(
            '(B=3,G=2,R=1,A=255)'
        )
    })
})

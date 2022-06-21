/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    Comment,
    CommentFrame,
    KismetColor,
} from '../../src/structures/index.js'

describe('comment', () => {
    const color = new KismetColor().setColor('R', 20)

    test('constructor options', () => {
        expect(new Comment().comment).toEqual('Comment')
        expect(new Comment('test').comment).toEqual('test')
    })

    test('type guard and equality', () => {
        expect(new Comment().equals(new CommentFrame())).toBe(true)

        expect(new Comment().isCommentFrame()).toBe(false)
        expect(new CommentFrame().isCommentFrame()).toBe(true)

        expect(new Comment().setBorder().isCommentFrame()).toBe(true)
    })

    test('comment border', () => {
        expect(new Comment().setBorder({ width: 100 }).borderWidth).toBe(100)
        expect(
            new Comment().setBorder({
                color,
            }).borderColor
        ).toBe(color)

        expect(new Comment().setBorder({ width: undefined }).borderWidth).toBe(
            new Comment().borderWidth
        )
        expect(
            new Comment().setBorder({ color: undefined }).borderColor
        ).toEqual(new Comment().borderColor)
        expect(new Comment().setBorder().drawBox).toBe(true)
    })

    test('comment fill', () => {
        expect(new Comment().setFilled({ color }).fillColor).toBe(color)
        expect(new Comment().setFilled({ tileFill: true }).tileFill).toBe(true)
        expect(new Comment().setFilled({ material: 'test' }).fillMaterial).toBe(
            'test'
        )
        expect(new Comment().setFilled({ texture: 'test' }).fillTexture).toBe(
            'test'
        )

        expect(new Comment().setFilled({ color: undefined }).fillColor).toEqual(
            new Comment().fillColor
        )
        expect(
            new Comment().setFilled({ material: undefined }).fillMaterial
        ).toBe(new Comment().fillMaterial)
        expect(
            new Comment().setFilled({ texture: undefined }).fillTexture
        ).toBe(new Comment().fillTexture)
        expect(new Comment().setFilled({ tileFill: undefined }).tileFill).toBe(
            new Comment().tileFill
        )
        expect(new Comment().setFilled().filled).toBe(true)
    })

    test('comment style', () => {
        expect(new Comment().setStyle('default')).not.toEqual(new Comment())

        // invalid style
        //@ts-expect-error
        expect(() => new Comment().setStyle('test')).toThrowError()
    })

    test('comment string / json', () => {
        expect(new Comment().toJSON().SizeX).toBeDefined()

        expect(new Comment().toString()).toContain('SizeX')
    })
})

import { builders } from "./builders/index.js";

import { describe, expect, it } from 'vitest';

describe('base item', () => {
    it('construct', () => {
        expect(() => builders.nodeBuilder({ ObjectArchetype: undefined })).toThrowError()

        expect(builders.nodeBuilder({ index: 331 }).rawName).toEqual('Archetype_331')
    })

    it('item position', () => {
        const item = builders.nodeBuilder()

        expect(item.setPosition({ x: 500, y: 0 }).position).toStrictEqual({ x: 500, y: 0 })
        expect(item.setPosition({ x: 500, y: -100 }, true).position).toStrictEqual({ x: 1000, y: -100 })

        expect(item.rawData.ObjPosX).toEqual(item.position.x)
        expect(item.rawData.ObjPosY).toEqual(item.position.y)
    })

    it('equals', () => {
        const a = builders.nodeBuilder(), b = builders.nodeBuilder()

        expect(a.strictEquals(a)).toBeTruthy()
        expect(a.equals(b)).toBeTruthy()
        expect(a.strictEquals(b)).toBeFalsy()
    })
})
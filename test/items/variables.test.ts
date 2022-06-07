import {
    Bool,
    External,
    Float,
    Integer,
    InterpData,
    Named,
    Object,
    ObjectList,
    ObjectVolume,
    Player,
    RandomFloat,
    RandomInteger,
    String,
    Vector,
} from '../../src/items/Variables/index.js'

import { builders } from '../../src/structures/builders/index.js'

const seqVar = builders.variableBuilder()

const getClassType = (variable: typeof seqVar): string => {
    return variable['kismet']['classType']
}

describe('default sequence variables', () => {
    test('boolean variable', () => {
        expect(new Bool().value).toBe(false)
        expect(new Bool().setValue(false).value).toBe(false)
        expect(new Bool().setValue(true).value).toBe(true)

        expect(new Bool().setValue(true).toString()).toContain('bValue=1')
        expect(new Bool().setValue(false).toString()).toContain('bValue=0')

        const bool = new Bool()
        /** @deprecated  */
        expect(bool.toKismet()).toEqual(bool.toString())
    })

    test('external variable', () => {
        expect(new External().expectedType).toBeNull()
        expect(new External().variableLabel).toBeNull()

        expect(
            new External().setExternalVariable({ label: 'test' }).variableLabel
        ).toEqual('test')
        expect(
            new External().setExternalVariable({ type: new External() })
                .expectedType
        ).toEqual(getClassType(new External()))

        expect(
            new External().setExternalVariable({ label: 'test' }).toString()
        ).toContain('VariableLabel')
        expect(
            new External()
                .setExternalVariable({ type: new External() })
                .toString()
        ).toContain('ExpectedType')

        const external = new External()
        /** @deprecated  */
        expect(external.toKismet()).toEqual(external.toString())
    })

    test('float variable', () => {
        expect(new Float().value).toBe(0.0)
        expect(() => new Float().setValue(1)).not.toThrowError()
        expect(() => new Float().setValue(1.2)).not.toThrowError()
        expect(() =>
            new Float({ allowIntegers: false }).setValue(1)
        ).toThrowError()
        expect(new Float().setValue(1.0).value).toBe(1.0)

        const float = new Float()
        /** @deprecated  */
        expect(float.toKismet()).toEqual(float.toString())
    })

    test('integer variable', () => {
        expect(new Integer().value).toBe(0)
        expect(new Integer().setValue(1).value).toBe(1)

        expect(() => new Integer().setValue(1.2)).toThrowError()

        expect(new Integer().toString()).toContain('IntValue')

        const int = new Integer()
        /** @deprecated  */
        expect(int.toKismet()).toEqual(int.toString())
    })

    test('interpdata variable', () => {
        expect(new InterpData().bakeAndPrune).toBe(false)
        expect(
            new InterpData().setBakeOptions({ bakeAndPrune: true }).bakeAndPrune
        ).toBe(true)
        expect(
            new InterpData().setBakeOptions({ bakeAndPrune: undefined })
                .bakeAndPrune
        ).toBe(false)

        expect(new InterpData().toString()).toContain('bShouldBakeAndPrune')

        const interp = new InterpData()
        /** @deprecated  */
        expect(interp.toKismet()).toEqual(interp.toString())
    })

    test('named variable', () => {
        expect(new Named().expectedType).toBeNull()
        expect(new Named().searchVariableName).toBeNull()

        expect(
            new Named().setSearchVariable({ name: 'test' }).searchVariableName
        ).toEqual('test')
        expect(
            new Named().setSearchVariable({ type: new Named() }).expectedType
        ).toEqual(getClassType(new Named()))

        expect(
            new Named().setSearchVariable({ name: 'test' }).toString()
        ).toContain('FindVarName')
        expect(
            new Named().setSearchVariable({ type: new Named() }).toString()
        ).toContain('ExpectedType')

        const named = new Named()
        /** @deprecated  */
        expect(named.toKismet()).toEqual(named.toString())
    })

    test('object variable', () => {
        expect(new Object().value).toEqual('')
        expect(new Object().setValue('test').value).toEqual('test')

        expect(new Object().toString()).toContain('ObjValue=None')
        expect(new Object().setValue('test').toString()).toContain(
            'ObjValue=test'
        )

        const obj = new Object()
        /** @deprecated  */
        expect(obj.toKismet()).toEqual(obj.toString())
    })

    test('object list variable', () => {
        expect(new ObjectList().addItem('test').values[0]).toEqual('test')
        expect(
            new ObjectList().addItems(['test_0', 'test_1']).values
        ).toContain('test_1')

        const objList = new ObjectList().addItems(['test', 'test_0', 'test_1'])
        expect(objList.toString()).toContain('ObjList(2)')

        /** @deprecated  */
        expect(objList.toKismet()).toEqual(objList.toString())
    })

    test('object volume variable', () => {
        expect(new ObjectVolume().collidingOnly).toBe(true)
        expect(new ObjectVolume().setCollidingOnly(false).collidingOnly).toBe(
            false
        )

        expect(new ObjectVolume().excludeClasses).toContain(
            `Class'Engine.Trigger'`
        )
        expect(
            new ObjectVolume().excludeClass('Archetype', 'Test').excludeClasses
        ).toContain(`Class'Test.Archetype'`)

        expect(new ObjectVolume().toString()).toContain('ExcludeClassList(1)')
        expect(new ObjectVolume().toString()).toContain('bCollidingOnly')

        const objVolume = new ObjectVolume()
        /** @deprecated  */
        expect(objVolume.toKismet()).toEqual(objVolume.toString())
    })

    test('player variable', () => {
        expect(new Player().allPlayers).toBe(true)
        expect(new Player().playerIndex).toBe(0)

        expect(new Player().setAllPlayer(false).allPlayers).toBe(false)
        expect(new Player().setPlayerIndex(1).playerIndex).toBe(1)

        expect(new Player().toString()).toContain('bAllPlayers')

        const player = new Player()
        /** @deprecated  */
        expect(player.toKismet()).toEqual(player.toString())
    })

    test('random float variable', () => {
        expect(new RandomFloat().minValue).toBe(0.0)
        expect(new RandomFloat().maxValue).toBe(1.0)

        expect(new RandomFloat().setMinValue(1).minValue).toBe(1)
        expect(new RandomFloat().setMaxValue(1).maxValue).toBe(1)

        expect(() =>
            new RandomFloat().setMinValue(50).setMaxValue(49)
        ).toThrowError()
        expect(() =>
            new RandomFloat({ allowIntegers: false }).setMinValue(1)
        ).toThrowError()
        expect(() =>
            new RandomFloat({ allowIntegers: false }).setMaxValue(2)
        ).toThrowError()

        expect(new RandomFloat().toString()).toContain('Min')
        expect(new RandomFloat().toString()).toContain('Max')

        expect(new RandomFloat().equals(new Float())).toBe(false)

        const rFloat = new RandomFloat()
        /** @deprecated  */
        expect(rFloat.toKismet()).toEqual(rFloat.toString())
    })

    test('random integer variable', () => {
        expect(new RandomInteger().minValue).toBe(0)
        expect(new RandomInteger().maxValue).toBe(100)

        expect(new RandomInteger().setMinValue(1).minValue).toBe(1)
        expect(new RandomInteger().setMaxValue(101).maxValue).toBe(101)

        expect(() =>
            new RandomInteger().setMinValue(50).setMaxValue(49)
        ).toThrowError()
        expect(() => new RandomInteger().setMinValue(1.2)).toThrowError()

        expect(new RandomInteger().toString()).toContain('Min')
        expect(new RandomInteger().toString()).toContain('Max')

        expect(new RandomInteger().equals(new Integer())).toBe(false)

        const rInt = new RandomInteger()
        /** @deprecated  */
        expect(rInt.toKismet()).toEqual(rInt.toString())
    })

    test('string variable', () => {
        expect(new String().value).toBe('')
        expect(new String().setValue('test').value).toBe('test')

        expect(new String().setValue('test').toString()).toContain('StrValue')

        const str = new String()
        /** @deprecated  */
        expect(str.toKismet()).toEqual(str.toString())
    })

    test('vector variable', () => {
        expect(new Vector().value).toEqual({ x: 0, y: 0, z: 0 })
        expect(new Vector().setValue({ x: 1, y: 1, z: 2 }).value).toEqual({
            x: 1,
            y: 1,
            z: 2,
        })

        expect(new Vector().toString()).toContain('VectValue')

        const vector = new Vector()
        /** @deprecated  */
        expect(vector.toKismet()).toEqual(vector.toString())
    })
})

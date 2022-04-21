import {
    nodeCategoryClasses,
    nodeCategories
} from '../../src/parser/blender/category.js'
import { variableBlenderType } from '../../src/parser/blender/node/variable.js'
import { BlenderAddonGenerator } from '../../src/parser/blender/parser.js'
import {
    operatorTemplate,
    baseTemplate,
    classTemplate
} from '../../src/parser/blender/templates/index.js'

import { JSONnode } from '../../src/structures/builders/index.js'

import type { UnrealJsonReadFileNode } from '../../src/types/index.js'

// For now only test that it returns something
describe('blender addon generator', () => {
    test('templates options', () => {
        expect(operatorTemplate({ paperclip: true, log: false })).toContain(
            'paperclip'
        )
        expect(operatorTemplate({ paperclip: false, log: true })).toContain(
            'print(sequence_text'
        )

        expect(baseTemplate(false)).not.toContain('import paperclip')

        expect(classTemplate(JSONnode as UnrealJsonReadFileNode)).toBeTruthy()
        expect(classTemplate(JSONnode as UnrealJsonReadFileNode)).toContain(
            JSONnode.Class
        )

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { displayName, ...node } = JSONnode
        expect(classTemplate(JSONnode as UnrealJsonReadFileNode)).toContain(
            JSONnode.Class
        )
        expect(classTemplate(node as UnrealJsonReadFileNode)).toContain(
            JSONnode.Class
        )
    })

    test('template category', () => {
        const categories = {
            test: ['test1', 'test2', 'test3']
        }

        expect(nodeCategories(categories)).toBeTruthy()
        expect(nodeCategoryClasses(categories)).toBeTruthy()
    })

    test('template variable formatting', () => {
        expect(variableBlenderType('bool')).toHaveProperty(['socket'])
        expect(variableBlenderType('string')).toHaveProperty(['Class'])
    })

    test('template generation', () => {
        expect(BlenderAddonGenerator.create([])).toBeTruthy()
    })
})

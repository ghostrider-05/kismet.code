import { filterMultipleEmptyLines } from '@kismet.ts/shared'
import {
    UnrealJsonReadFile,
    UnrealJsonReadFileNode,
} from '../extractor/files.js'

import { createCategories } from './category.js'

import {
    baseTemplate,
    classTemplate,
    operatorTemplate,
    registerTemplate,
} from './templates/index.js'

export interface BlenderAddonGeneratorOptions {
    copy?: boolean
    log?: boolean
    register?: boolean
}


export class BlenderAddonGenerator {
    public static create (
        nodes: UnrealJsonReadFileNode[],
        classes: Partial<UnrealJsonReadFile>[],
        options?: BlenderAddonGeneratorOptions
    ) {
        console.log('Blender nodes: ' + nodes.length)

        const categories = createCategories(nodes)

        const nodeTemplate = (node: UnrealJsonReadFileNode) =>
            classTemplate(node, classes)
        const content = [
            baseTemplate(options?.copy ?? true),
            ...nodes.map(nodeTemplate),
            operatorTemplate({
                copy: options?.copy ?? true,
                log: options?.log ?? true,
            }),
            registerTemplate(categories, {
                register: options?.register ?? true,
            }),
        ].join('\n\n')

        return filterMultipleEmptyLines(content)
    }
}

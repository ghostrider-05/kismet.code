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
    /**
     * Whether to include the paperclip import or not
     */
    copy?: boolean
    /**
     * Whether to log the kismet sequence to the console
     */
    log?: boolean
    /**
     * Whether to add the class registration function
     */
    register?: boolean
    /**
     * Whether the plugin is standalone or not.
     * If true, will attach a bl_info object with metadata.
     */
    standalone?: boolean
    /**
     * Add extra nodes to the blender addon
     */
    additionalNodes?: UnrealJsonReadFileNode[]
}

export class BlenderAddonGenerator {
    public static create (
        nodes: UnrealJsonReadFileNode[],
        classes: Partial<UnrealJsonReadFile>[],
        options?: BlenderAddonGeneratorOptions
    ) {
        nodes = nodes.concat(options?.additionalNodes ?? [])
        console.log('Blender nodes: ' + nodes.length)

        const categories = createCategories(nodes)

        const nodeTemplate = (node: UnrealJsonReadFileNode) =>
            classTemplate(node, classes)
        const content = [
            baseTemplate(options?.copy ?? true, options?.standalone ?? true),
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

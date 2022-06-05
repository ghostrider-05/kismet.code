import { createWriteStream } from 'fs'
import { writeFile } from 'fs/promises'

import { groupByProperty } from '../../shared/index.js'
import { UnrealJsonReadFile, UnrealJsonReadFileNode } from '../../types/index.js'
import { formatStructure } from './node/structures.js'
import { variableBlenderType } from './node/variable.js'
import {
    baseTemplate,
    classTemplate,
    operatorTemplate,
    registerTemplate
} from './templates/index.js'

export interface BlenderAddonGeneratorOptions {
    copy?: boolean
    logSequence?: boolean
    register?: boolean
}

const createCategories = (nodes: UnrealJsonReadFileNode[]) => {
    return groupByProperty(nodes, 'type')
        .map(items => {
            return {
                [items[0].type]: items.map(item => item.Class)
            }
        })
        .reduce((prev, curr) => ({ ...prev, ...curr }), {})
}

export class BlenderAddonGenerator {
    static create (
        nodes: UnrealJsonReadFileNode[],
        classes: Partial<UnrealJsonReadFile>[],
        options?: BlenderAddonGeneratorOptions
    ) {
        console.log('Blender nodes: ' + nodes.length)

        const categories = createCategories(nodes)

        const nodeTemplate = (node: UnrealJsonReadFileNode) => classTemplate(node, classes)
        const content = [
            baseTemplate(options?.copy ?? true),
            ...nodes.map(nodeTemplate),
            operatorTemplate({
                paperclip: options?.copy ?? true,
                log: options?.logSequence ?? true
            }),
            registerTemplate(categories, {
                register: options?.register ?? true
            })
        ].join('\n\n')

        //https://stackoverflow.com/questions/21817453/replace-multiple-blank-lines-in-text-using-javascript
        const EOL = content.match(/\r\n/gm) ? '\r\n' : '\n'
        const regExp = new RegExp(`(${EOL}){3,}`, 'gm')

        return content.replace(regExp, EOL + EOL)
    }

    static async write (path: string, content: string) {
        // Empty file
        await writeFile(path, '')

        const stream = createWriteStream(path, {
            flags: 'a'
        })

        stream.write(content)
    }
}

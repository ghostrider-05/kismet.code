import { createWriteStream } from 'fs'
import { writeFile } from 'fs/promises'

import { groupByProperty } from '../../shared/index.js'
import { UnrealJsonReadFileNode } from '../../types/index.js'
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
        options?: BlenderAddonGeneratorOptions
    ) {
        console.log('Blender nodes: ' + nodes.length)

        const categories = createCategories(nodes)

        const content = [
            baseTemplate(options?.copy ?? true),
            ...nodes.map(classTemplate),
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

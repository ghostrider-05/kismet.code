import * as fs from 'fs';
import { resolve } from 'path';

import { readNodeFile } from './read.js'
import { actions, events } from './templates.js'

import { 
    filterEmptyLines, 
    groupByProperty, 
    t 
} from '../shared/index.js'

import type { 
    RawUnrealJsonFile
} from '../types/index.js'

type ClassInfo = { name: string, type: string, category: string }

const collectedClasses: Record<string, ClassInfo[]> = {
    actions: [],
    events: []
}

const writeFile = (path: string, content: string) => fs.writeFile(path, filterEmptyLines(content), (err) => {
    if (err) {
        console.error(err)
    }
})

function getExportFile (classes: ClassInfo[], groupExportItems: boolean) {
    const importStatement = (name: string) => `import ${name} from ./Classes/${name}.ts`
    const exportStatement = (items: (string | ClassInfo)[]) => groupExportItems ? `
    export {
        ${groupByProperty(t<ClassInfo[]>(items), '').map(group => {
            return `    ${group[0].category}: {
                ${group.map(item => item.name).join(',\n')}
            }`
        })}
    }` : `export {
        ${t<string[]>(items).join(',\n')}
    }`

    if (classes?.length === 0) return '';
    const classNames = classes.map(item => item.name)

    const content = classNames.map(name => importStatement(name))
        .concat(exportStatement(groupExportItems ? classes : classNames))
        .join('\n')

    return content
}

export async function findClasses (paths: { importPath: string, exportPath: string }, groupItems = false): Promise<void> {
    const { importPath, exportPath } = paths

    if (!importPath || !fs.existsSync(importPath)) {
        console.error(`Could not find path: ${importPath}`)
        return;
    }

    if (!exportPath || !fs.existsSync(exportPath)) {
        console.error(`Could not find path: ${exportPath}`)
        return;
    }

    const Packages = fs.readdirSync(importPath);

    for (const Package of Packages) {
        const path = [importPath]
            .concat(Package, '.Classes', '.json')
            .join('\\')

        if (!fs.existsSync(path)) {
            console.error(`Could not find path: ${path}`)
            continue;
        }

        const kismetNodes = fs.readdirSync(path).filter(file => {
            return file.toLowerCase().startsWith('seq') && !file.startsWith('Sequence')
        })

        for (const file of kismetNodes) {
            const fileContent = fs.readFileSync(path + '\\' + file, 'utf-8')
            const fileJSON = JSON.parse(fileContent) as RawUnrealJsonFile

            const node = readNodeFile(fileJSON, Package)

            const { name, category, type } = node
                
            const output = exportPath.concat(`${type}/Classes/${name}.ts`)

            collectedClasses[type]?.push({
                name,
                category,
                type
            })

            switch (type) {
                case 'actions':
                    return writeFile(resolve('.', output), actions(node))
                case 'events':
                    return writeFile(resolve('.', output), events(node))
                default:
                    console.log('Invalid type for class:' + node.Class)
                    continue;
            }
        }
    }

    // Generate export files to export all the classes
    const exportedPaths: string[] = []

    Object.keys(collectedClasses).forEach(key => {
        const content = getExportFile(collectedClasses[key], groupItems)
        const path = resolve('.', exportPath.concat(`${key}/index.ts`))

        exportedPaths.push(`./${key}/index.ts`)

        writeFile(path, content)
    })

    if (exportedPaths.length > 0) {
        const exports = exportedPaths.map(path => `export * from '${path}'`).join('\n')
        writeFile(resolve('.', exportPath.concat(`index.ts`)), exports)
    }
}
import * as fs from 'fs';
import { writeFile as writeToFile } from 'fs/promises'
import { resolve } from 'path';

import { readNodeFile, _validateNodeInput } from './read.js'
import { actions, conditions, events } from './templates.js'

import { 
    Constants,
    filterEmptyLines, 
    groupByProperty, 
    t 
} from '../shared/index.js'

import type { 
    JsonFile,
    PathInput,
    RawUnrealJsonFile
} from '../types/index.js'

const { NodeType } = Constants

const collectedClasses: Record<string, JsonFile[]> = {
    actions: [],
    events: [],
    conditions: []
}

const writeFile = async (path: string, content: string) => {
    return await writeToFile(path, filterEmptyLines(content), { encoding: 'utf8' })
}

function getExportFile (classes: JsonFile[], groupItems: boolean) {
    const importStatement = (name: string) => `import { ${name} } from './Classes/${name}.js'`

    const exportStatement = (items: (string | JsonFile)[]) => {
        const groupExport = groupItems ? groupByProperty(classes, 'Package').map(items => {
            return `export const ${items[0].Package} = {\n\t${items.map(n => n.name).join(',\n\t')}\n}`
        }).join('\n') : ''
        
        return `\n\nexport {\n\t${t<string[]>(items).join(',\n\t')}\n}\n\n${groupExport}`
    }

    if (classes?.length === 0) return '';

    const classNames = classes.map(item => item.name)

    const content = classNames.map(importStatement)
        .concat('\n', exportStatement(classNames))
        .join('\n')

    return content
}

export async function findClasses (paths: PathInput, groupItems = false): Promise<void> {
    const { importPath, exportPath } = paths

    if (!importPath || !fs.existsSync(importPath)) {
        console.warn(`Could not find path: ${importPath}`)
        return;
    }

    if (!exportPath || !fs.existsSync(exportPath)) {
        console.warn(`Could not find path: ${exportPath}`)
        return;
    }

    const Packages = fs.readdirSync(importPath);

    for await (const Package of Packages) {
        const path = [importPath]
            .concat(Package, '.Classes', '.json')
            .join('\\')

        if (!fs.existsSync(path)) {
            console.warn(`Invalid folder for class package: ${path}`)
            continue;
        }

        const kismetNodes = fs.readdirSync(path).filter(file => {
            return file.toLowerCase().startsWith('seq') && !file.toLowerCase().startsWith('sequence')
        })

        for await (const file of kismetNodes) {
            const fileContent = fs.readFileSync(path + '\\' + file, 'utf-8')
            const fileJSON = JSON.parse(fileContent) as RawUnrealJsonFile

            if (!_validateNodeInput(fileJSON)) {
                console.warn(`Invalid input for ${Package}.${file.split('.')[0]}`)
                continue
            }

            const node = readNodeFile(fileJSON, Package)

            const { name, category, type } = node

            if (collectedClasses[type]?.some(n => n.name === name)) {
                continue
            }
                
            const output = exportPath.concat(`/${type}/Classes/${name}.ts`)

            try {
                switch (type) {
                    case NodeType.ACTIONS:
                        await writeFile(resolve('.', output), actions(node))
                        break
                    case NodeType.CONDITIONS:
                        await writeFile(resolve('.', output), conditions(node))
                        break
                    case NodeType.EVENTS:
                        await writeFile(resolve('.', output), events(node))
                        break
                    default:
                        console.log('Invalid type for class:' + node.Class)
                }
                
                collectedClasses[type]?.push({
                    name,
                    category,
                    type,
                    Package
                })

            } catch (err) {
                const error = err as {
                    code: string
                    path: string
                    syscall: string
                }

                if (error.code === 'ENOENT' && error.syscall === 'open') {
                    console.warn(`Invalid path: ${error.path}`)
                } else console.error(error)
            }
        }
    }

    // Generate export files to export all the classes
    const exportedPaths: [string, string][] = []

    Object.keys(collectedClasses).forEach(key => {
        const content = getExportFile(collectedClasses[key], groupItems)
        const path = resolve('.', './' + exportPath.concat(`/${key}/index.ts`))

        exportedPaths.push([`./${key}/index.js`, key])

        writeFile(path, content)
    })

    if (exportedPaths.length > 0) {
        const exports = exportedPaths.map(path => {
            return `export * as ${path[1]} from '${path[0]}'`
        }).join('\n')

        writeFile(resolve('.', './' + exportPath.concat(`/index.ts`)), exports)
    }
}
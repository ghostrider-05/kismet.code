import { resolve } from 'path'

import { getExportFile, writeFile } from './files.js'
import { actions, conditions, events } from '../templates.js'
import { nodeToJSON } from '../read.js'

import { Constants } from '../../shared/index.js'

import type {
    JsonFile,
    PathReadError,
    UnrealJsonReadFile
} from '../../types/index.js'

const { NodeType } = Constants

function _fileContent (node: UnrealJsonReadFile) {
    let content = null

    switch (node.type) {
        case NodeType.ACTIONS:
            content = actions(node)
            break
        case NodeType.CONDITIONS:
            content = conditions(node)
            break
        case NodeType.EVENTS:
            content = events(node)
            break
        default:
            console.log('Invalid type for class:' + node.Class)
            break
    }

    return content
}

export const writeNode = async (
    path: string,
    node: UnrealJsonReadFile,
    options: {
        json?: boolean
        Package: string
    }
): Promise<
    { jsonNode?: Record<string, unknown>; Class?: JsonFile } | undefined
> => {
    const { name, category, type } = node

    const output: { jsonNode?: Record<string, unknown>; Class?: JsonFile } = {
        jsonNode: undefined,
        Class: undefined
    }

    try {
        const nodeContent = _fileContent(node)
        await writeFile(resolve('.', path), <string>nodeContent)

        if (options.json && !!nodeContent) {
            output.jsonNode = nodeToJSON(node)
        }

        output.Class = {
            name,
            category,
            type,
            Package: options.Package
        }

        return output
    } catch (err) {
        const error = err as PathReadError

        if (error.code === 'ENOENT' && error.syscall === 'open') {
            console.warn(`Invalid path: ${error.path}`)
        } else console.error(error)
    }
}

export function writePackages (
    exportPath: string,
    files: {
        classes: Record<string, JsonFile[]>
        json: Record<string, unknown>[]
        groupItems: boolean
    }
): void {
    const exportedPaths: [string, string][] = []

    Object.keys(files.classes).forEach(key => {
        const content = getExportFile(
            files.classes[key],
            <boolean>files.groupItems
        )
        const path = resolve('.', './' + exportPath.concat(`/${key}/index.ts`))

        exportedPaths.push([`./${key}/index.js`, key])

        writeFile(path, content)
    })

    if (exportedPaths.length > 0) {
        const exports = exportedPaths
            .map(path => {
                return `export * as ${path[1]} from '${path[0]}'`
            })
            .join('\n')

        writeFile(resolve('.', './' + exportPath.concat(`/index.ts`)), exports)
    }

    if (files.json.length > 0)
        writeFile(
            resolve('.', './' + exportPath.concat(`/nodes.json`)),
            JSON.stringify(files.json)
        )
}

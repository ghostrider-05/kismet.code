import { resolve } from 'path'

import { Constants, capitalize, If } from '@kismet.ts/shared'

import { getExportFile } from './files.js'
import { catchFileWriteError, writeEmptyFile, writeFilteredFile } from './node.js'
import * as classTemplate from '../extractor/templates.js'
import { nodeToJSON } from '../extractor/read.js'

import {
    BlenderAddonGenerator,
    BlenderAddonGeneratorOptions,
} from '../blender/parser.js'

import type {
    JsonFile,
    UnrealJsonReadFile,
    UnrealJsonReadFileNode,
} from '../extractor/files.js'

const { NodeType } = Constants

const createPath = (path: string, end?: string) => {
    return resolve('.', './' + path.concat(end ?? ''))
}

export function fillClassTemplate (node: UnrealJsonReadFile) {
    let content = null

    switch (node.type) {
        case NodeType.ACTIONS:
            content = classTemplate.actions(node)
            break
        case NodeType.CONDITIONS:
            content = classTemplate.conditions(node)
            break
        case NodeType.EVENTS:
            content = classTemplate.events(node)
            break
        case NodeType.VARIABLES:
            content = classTemplate.variables(node)
            break
        default:
            console.log('Invalid type for class:' + node.Class)
            break
    }

    return content
}

export interface NodeWriteOptions {
    json?: boolean
    path: string
    Package: string
}

export interface PackageWriteOptions<T extends boolean = true> {
    exportPath: string
    classes: Record<string, JsonFile[]>
    externalClasses: Partial<UnrealJsonReadFile>[]
    writeIndexFile: boolean
    version: string | null
    json: UnrealJsonReadFileNode[]
    groupItems: boolean
    blender: T
    isMainFolder: boolean
    blenderOptions?: If<T, BlenderAddonGeneratorOptions>
}

export type NodeWriteResponse =
    | {
          jsonNode?: UnrealJsonReadFileNode
          Class?: JsonFile
      }
    | undefined

class FileName {
    static JSON = 'nodes'
    static Blender = 'kismet-addon'
    static Classes = 'classes'
}

export const writeNode = async (
    node: UnrealJsonReadFile,
    options: NodeWriteOptions
): Promise<NodeWriteResponse> => {
    const { name, category, type } = node

    const output: { jsonNode?: UnrealJsonReadFileNode; Class?: JsonFile } = {
        jsonNode: undefined,
        Class: undefined,
    }

    const nodeContent = fillClassTemplate(node)
    if (!nodeContent) return

    await catchFileWriteError(async () => {
        await writeFilteredFile(resolve('.', options.path), nodeContent)

        if (options.json /*&& !!nodeContent*/) {
            output.jsonNode = nodeToJSON(node)
        }

        output.Class = {
            name,
            category,
            type,
            Package: options.Package,
        }
    })

    return output
}

async function writeCategory<T extends boolean = true> (
    key: string,
    options: PackageWriteOptions<T>
) {
    const content = getExportFile(options.classes[key], options.groupItems)

    const path = createPath(options.exportPath, `/${key}/index.ts`)

    await writeFilteredFile(path, content)

    return `export * as ${capitalize(key)} from './${key}/index.js'`
}

function setup (path: string) {
    return async function writeData (
        items: unknown[],
        file: string,
        data?: string
    ) {
        if (items.length > 0) {
            await writeFilteredFile(
                createPath(path + file),
                data ?? JSON.stringify(items)
            )
        }
    }
}

export async function writePackages<T extends boolean = true> (
    options: PackageWriteOptions<T>
): Promise<void> {
    const exportedPaths: string[] = []
    const { classes, json, blender, blenderOptions, externalClasses, version } = options

    for (const category of Object.keys(classes)) {
        if (classes[category].length > 0) {
            const categoryPath = await writeCategory(category, options)

            exportedPaths.push(categoryPath)
        }
    }

    const writer = setup(options.exportPath)

    if (version) {
        await writeFilteredFile(
            createPath(options.exportPath + '/version.ts'),
            `export const version = '${version}'`
        )

        exportedPaths.push(`export * from './version.js'`)
    }

    if (options.writeIndexFile) {
        await writer(exportedPaths, './index.ts', exportedPaths.join('\n'))
    }
    await writer(json, `/${FileName.JSON}.json`)
    await writer(externalClasses, `/${FileName.Classes}.json`)

    if (blender)
        await writeEmptyFile(
            createPath(options.exportPath, `/${FileName.Blender}.py`),
            BlenderAddonGenerator.create(json, externalClasses, blenderOptions)
        )
}

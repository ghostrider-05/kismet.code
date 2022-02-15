import * as fs from 'fs'

import { readNodeFile } from './read.js'

import type {
    ExportOptions,
    JsonFile,
    PathInput,
    RawUnrealJsonFile
} from '../types/index.js'

import {
    _validatePackage,
    _validatePaths,
    _validateNodeInput
} from './utils/validate.js'

import { writeNode, writePackages } from './utils/write.js'

const collectedClasses: Record<string, JsonFile[]> = {
    actions: [],
    events: [],
    conditions: []
}

const jsonnodes: Record<string, unknown>[] = []

export async function findClasses (
    paths: PathInput,
    exportOptions?: ExportOptions
): Promise<void> {
    const { importPath, exportPath, packages } = paths
    let { groupItems, json } = exportOptions || {}

    groupItems ??= true
    json ??= false

    if (!_validatePaths([importPath, exportPath])) return

    const Packages = fs.readdirSync(importPath)

    for await (const Package of Packages) {
        const { kismetNodes, path } =
            _validatePackage(importPath, Package, packages) || {}

        if (!kismetNodes) {
            continue
        }

        for await (const file of kismetNodes) {
            const fileContent = fs.readFileSync(path + '\\' + file, 'utf-8')
            const fileJSON = JSON.parse(fileContent) as RawUnrealJsonFile

            if (!_validateNodeInput(fileJSON)) {
                console.warn(
                    `Invalid input for ${Package}.${file.split('.')[0]}`
                )
                continue
            }

            const node = readNodeFile(fileJSON, Package)

            if (collectedClasses[node.type]?.some(n => n.name === node.name)) {
                continue
            }

            const output = exportPath.concat(
                `/${node.type}/Classes/${node.name}.ts`
            )

            const { jsonNode, Class } =
                (await writeNode(output, node, { json, Package })) || {}

            if (jsonNode) jsonnodes.push(jsonNode)
            if (Class) collectedClasses[node.type]?.push(Class)
        }
    }

    // Generate export files to export all the classes
    writePackages(exportPath, {
        classes: collectedClasses,
        json: jsonnodes,
        groupItems
    })
}

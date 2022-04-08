import * as fs from 'fs'

import { readNodeFile } from './read.js'

import type {
    ExportOptions,
    JsonFile,
    PathInput,
    RawUnrealJsonFile,
    UnrealJsonReadFileNode
} from '../types/index.js'

import {
    _validatePackage,
    _validatePaths,
    _validateNodeInput,
    _validateSubPaths
} from './utils/validate.js'

import { writeNode, writePackages } from './utils/write.js'
import { BlenderAddonGenerator } from './blender/parser.js'

const collectedClasses: Record<string, JsonFile[]> = {
    actions: [],
    events: [],
    conditions: []
}

const jsonnodes: UnrealJsonReadFileNode[] = []

export async function findClasses (
    paths: PathInput,
    exportOptions?: ExportOptions
): Promise<void> {
    const { importPath, exportPath, packages } = paths
    // eslint-disable-next-line prefer-const
    let { groupItems, json, blenderPath } = exportOptions || {}

    groupItems ??= true
    json ??= false

    if (!_validatePaths([importPath, exportPath])) return
    await _validateSubPaths(exportPath, ['actions', 'conditions', 'events'])

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
                (await writeNode(output, node, { 
                    json: json || (blenderPath != undefined), 
                    Package 
                })) || {}

            if (jsonNode) jsonnodes.push(jsonNode)
            if (Class) collectedClasses[node.type]?.push(Class)
        }
    }

    console.log('Blender: ' + blenderPath)
    if (blenderPath != undefined) {
        const addon = BlenderAddonGenerator.create(jsonnodes)
        const stream = fs.createWriteStream(blenderPath!, {
            flags: 'a'
        })
        stream.write(addon)
    }

    // Generate export files to export all the classes
    writePackages(exportPath, {
        classes: collectedClasses,
        json: json ? jsonnodes : [],
        groupItems
    })
}

import * as fs from 'fs'

import type { ExportOptions, PathInput } from '../types/index.js'

import { _validatePaths, _validateSubPaths } from './utils/validate.js'

import { _defaultExportOptions } from './utils/options.js'
import { ClassManager } from './utils/ClassManager.js'

export async function findClasses (
    paths: PathInput,
    exportOptions?: ExportOptions | ExportOptions<false>
): Promise<true | undefined> {
    const { importPath, exportPath } = paths
    const options = _defaultExportOptions(exportOptions)
    const manager = new ClassManager().setOptions(options)

    await _validateSubPaths(exportPath, options.types)
    if (!_validatePaths(paths)) return

    for await (const Package of fs.readdirSync(importPath)) {
        await manager.readPackage({ name: Package, paths })
    }

    // Generate export files to export all the classes
    await manager.writePackages(exportPath)
    return true
}

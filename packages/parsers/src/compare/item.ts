import { basename, extname, isAbsolute, sep } from "path";
import { existsSync, readFileSync } from "fs";

import { TextNodeParser } from "../text/index.js";

function readPackageFromPath (path: string) {
    const parts = path.split(sep)
    const index = parts.findIndex(p => p === 'Classes' || p === '.Classes')

    return index > 0 ? parts.at(index - 1) : undefined 
}

/**
 * 
 * @param absolutePath 
 * @param Package 
 */
export function extractSourceFile (absolutePath: string, Package?: string) {
    Package ??= readPackageFromPath(absolutePath)

    if (!Package) throw new Error('Unable to find package name in path: ' + absolutePath)
    if (!isAbsolute(absolutePath) || extname(absolutePath) !== '.uc') throw new Error('Invalid absolute UnrealScript filepath: ' + absolutePath)
    if (!existsSync(absolutePath)) throw new Error('Path does not exist: ' + absolutePath)

    const name = basename(absolutePath, extname(absolutePath))
    const archetype = `${name}'${Package}.Default__${name}'`

    const content = readFileSync(absolutePath, { encoding: 'utf8' })
    
    const output = TextNodeParser.parseNodeClassFile(name, archetype, content)

    return output?.item
}
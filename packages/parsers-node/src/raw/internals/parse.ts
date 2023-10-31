import { basename, extname, isAbsolute, sep } from "path";
import { existsSync, readFileSync } from "fs";

import {
    RawUnrealClass, 
    RawUnrealLine, 
} from "./comparer.js";

function readPackageFromPath (path: string) {
    const parts = path.split(sep)
    const index = parts.findIndex(p => p === 'Classes' || p === '.Classes')

    return index > 0 ? parts.at(index - 1) : undefined 
}

function readRawFile (content: string, archetype: string): RawUnrealClass {
    function split (content: string) {
        const first = content.split('\r\n')
        if (content.includes('\n') && first.length === 1) return content.split('\n')
        else return first
    }

    const lines: RawUnrealLine[] = split(content)
        .map((l, i) => [l, i] as RawUnrealLine)
        .filter(([l]) => l.trim().length !== 0 && !['*', ' *', '/'].some(c => l.trim().startsWith(c)));

    const [, Class,, Extends, ...remainingFlags] = lines[0][0].split(' ');
    const flags: RawUnrealLine[] = lines.slice(1, lines.findIndex(l => l[0].includes(';')) + 1)
        .concat(remainingFlags.map(l => [l, lines[0][1]]))
        .flatMap(f => f[0].split(' ').map(t => [t.trim().replace('\t', '').replace(';', ''), f[1]] as RawUnrealLine))
        .filter(n => n[0].length > 0 && !['within'].includes(n[0]));

    const variables = lines.filter(l => ['var ', 'var('].some(s => l[0].startsWith(s)))
        .map(l => [l[0].split(';')[0], l[1]] as RawUnrealLine)

    const defaultIndex = lines.findIndex(l => l[0] === 'defaultproperties')
    const defaultproperties = lines.slice(defaultIndex, lines.indexOf(lines.find(x => x[0] === '}') ?? ['', 0], defaultIndex))
        .filter(l => (l[0].startsWith(' ') || l[0].startsWith('\t')) && !l[0].trim().replace('\t', '').startsWith('//'))
        .map(l => [l[0].replace('\t', '').trim(), l[1]] as RawUnrealLine)

    const raw = {
        ObjectArchetype: archetype,
        Class,
        Extends,
        flags,
        variables,
        defaultproperties
    } satisfies RawUnrealClass

    return raw
}

/**
 * Create a raw class from a class definition
 * @param absolutePath The path to the file of the class definition
 * @param Package Overwrite the package to use for the archetype. If no package is found in the path, it will throw an error
 */
export function extractSourceFile (absolutePath: string, Package?: string): RawUnrealClass {
    Package ??= readPackageFromPath(absolutePath)

    if (!Package) throw new Error('Unable to find package name in path: ' + absolutePath)
    if (!isAbsolute(absolutePath) || extname(absolutePath) !== '.uc') throw new Error('Invalid absolute UnrealScript filepath: ' + absolutePath)
    if (!existsSync(absolutePath)) throw new Error('Path does not exist: ' + absolutePath)

    const name = basename(absolutePath, extname(absolutePath))
    const archetype = `${name}'${Package}.Default__${name}'`

    const content = readFileSync(absolutePath, { encoding: 'utf8' })
    
    const output = readRawFile(content, archetype)

    return output
}
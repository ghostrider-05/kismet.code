import { existsSync, readdirSync } from 'fs'
import { mkdir } from 'fs/promises'
import { resolve } from 'path'

import { arrayUnionInput, isType } from '../../shared/index.js'
import type { PathInput } from '../../types/index.js'

export function _validateNodeInput (json: Record<string, unknown>): boolean {
    return (
        isType('string', json.name) &&
        isType('string', json.extends) &&
        isType('string', json.extendswithin) &&
        isType('array', json.variables, [
            'flags',
            'replicated',
            'name',
            'type'
        ]) &&
        isType('array', json.defaultproperties, ['name']) &&
        isType('object', json.enums) &&
        isType('array', json.constants, ['name', 'value'])
    )
}

export function _validatePaths (
    input: Partial<Omit<PathInput, 'packages'>>
): boolean {
    const paths = Object.keys(input)
        .map(key => input[key as keyof typeof input])
        .filter(n => n)
    if (paths.filter(n => n != undefined).length === 0) return false

    return paths.every(path => {
        const isValid = path && existsSync(path)
        if (!isValid) console.warn(`Could not find path: ${path}`)

        return isValid
    })
}

async function _validateSubPath (path: string, key: string): Promise<void> {
    const createPath = (end?: string) =>
        resolve('.', './' + path.concat(end ?? ''))

    if (!existsSync(createPath())) await mkdir(createPath())
    if (!existsSync(createPath(`./${key}/`)))
        await mkdir(createPath(`./${key}/`))
    if (!existsSync(createPath(`./${key}/Classes/`)))
        await mkdir(createPath(`./${key}/Classes/`))
}

export async function _validateSubPaths (
    path: string,
    key: string | string[]
): Promise<void[]> {
    const keys = arrayUnionInput(key)

    return await Promise.all(
        keys.map(async k => await _validateSubPath(path, k))
    )
}

export function _validatePackage (
    name: string,
    paths: Omit<PathInput, 'exportPath'>,
    includeClasses: boolean
): {
    kismetNodes: string[]
    path: string
} | null {
    const { importPath, packages } = paths
    const path = [importPath].concat(name, '.Classes', '.json').join('\\')

    if (
        !_validatePaths({
            importPath: path
        })
    )
        return null

    const kismetNodes = readdirSync(path).filter(file => {
        return (
            includeClasses ||
            (file.toLowerCase().startsWith('seq') &&
                !file.toLowerCase().startsWith('sequence'))
        )
    })

    if ((packages?.length ?? 0) > 0 ? !packages?.includes(name) : false) {
        return null
    }

    return { kismetNodes, path }
}

import { existsSync, readdirSync } from 'fs'
import { mkdir } from 'fs/promises'
import { resolve } from 'path'
import { arrayUnionInput, isType } from '../../shared/index.js'

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

export function _validatePaths (paths: (string | undefined)[]): boolean {
    if (paths.filter(n => n != undefined).length === 0) return false

    return paths.every(path => {
        const isValid = path && existsSync(path)
        if (!isValid) console.warn(`Could not find path: ${path}`)

        return isValid
    })
}

async function _validateSubPath (path: string, key: string): Promise<void> {
    const createPath = (end?: string) => resolve('.', './' + path.concat(end ?? ''))

    if (!existsSync(createPath())) await mkdir(createPath())
    if (!existsSync(createPath(`./${key}/`))) await mkdir(createPath(`./${key}/`))
    if (!existsSync(createPath(`./${key}/Classes/`))) await mkdir(createPath(`./${key}/Classes/`))
}

export async function _validateSubPaths (path: string, key: string | string[]): Promise<void[]> {
    const keys = arrayUnionInput(key)

    return await Promise.all(keys.map(async k => await _validateSubPath(path, k)))
}

export function _validatePackage (
    importPath: string,
    name: string,
    packageList?: string[]
): {
    kismetNodes: string[]
    path: string
} | null {
    const path = [importPath].concat(name, '.Classes', '.json').join('\\')

    if (!_validatePaths([path])) return null

    const kismetNodes = readdirSync(path).filter(file => {
        return (
            file.toLowerCase().startsWith('seq') &&
            !file.toLowerCase().startsWith('sequence')
        )
    })

    if ((packageList?.length ?? 0) > 0 ? !packageList?.includes(name) : false) {
        return null
    }

    return { kismetNodes, path }
}

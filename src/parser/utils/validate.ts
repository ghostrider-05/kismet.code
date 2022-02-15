import { existsSync, readdirSync } from 'fs'
import { isType } from '../../shared/index.js'

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

export function _validatePaths (paths: string[]): boolean {
    return paths.every(path => {
        const isValid = path && existsSync(path)
        if (!isValid) console.warn(`Could not find path: ${path}`)

        return isValid
    })
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

    if ((packageList?.length ?? 0) > 0 && !packageList?.includes(name)) {
        return null
    }

    return { kismetNodes, path }
}

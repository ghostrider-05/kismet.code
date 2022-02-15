import { existsSync } from 'fs'
import { resolve } from 'path'

import { findClasses } from '../../parser/index.js'

import { PathInput } from '../../types/index.js'

export class CustomNodesManager {
    public groupExportItems: boolean
    public packages: string[] | undefined = undefined

    public importPath: string | null = null
    public exportPath: string
    public exportTypes: 'json'[] = []

    constructor (relativeFilePath: string) {
        this.exportPath = relativeFilePath

        this.groupExportItems = false
    }

    private isPath (inputPath: string): boolean {
        return existsSync(inputPath) || existsSync(resolve('.', inputPath))
    }

    private resolvePath (path: string): string {
        return !existsSync(path) ? resolve('.', path) : path
    }

    private addExportType (type: never) {
        if (this.exportTypes.includes(type)) return
        this.exportTypes.push(type)
    }

    public async createCustomNodeFiles (): Promise<void> {
        if (!this.importPath) {
            this.importPath = ''
        }

        const paths: PathInput = {
            importPath: this.importPath,
            exportPath: this.exportPath,
            packages: this.packages
        }

        return await findClasses(paths, {
            groupItems: this.groupExportItems,
            json: this.exportTypes.includes('json')
        })
    }

    public hasCustomNodeFiles (): boolean {
        return existsSync(resolve('.', this.exportPath))
    }

    public setExportOptions (options: {
        groupExportItems: boolean
        json: boolean
    }): this {
        const { groupExportItems, json } = options

        this.groupExportItems = groupExportItems
        if (json) this.addExportType(<never>'json')

        return this
    }

    public setImportPath (path: string): this {
        this.importPath = path

        return this
    }

    public setExportPath (path: string): this {
        if (!this.isPath(path)) {
            console.error('Could not find path:' + path)
        }

        this.exportPath = this.resolvePath(path)

        return this
    }

    public setClassPackages (names: string[]): this {
        this.packages = names

        return this
    }
}

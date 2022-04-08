import { existsSync } from 'fs'
import { resolve } from 'path'

import { findClasses } from '../../parser/index.js'

import { ExportOptions, PathInput } from '../../types/index.js'

export class CustomNodesManager {
    public groupExportItems = false
    public packages: string[] | undefined = undefined

    public importPath: string | null = null
    public exportPath: string | null = null

    public blenderPath: string | null = null
    public exportTypes: 'json'[] = []

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
        if (!this.hasCustomNodeFiles()) throw new Error('Invalid export path')

        const paths: PathInput = {
            importPath: this.importPath,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            exportPath: this.exportPath!,
            packages: this.packages
        }

        return await findClasses(paths, {
            groupItems: this.groupExportItems,
            json: this.exportTypes.includes('json'),
            blenderPath: this.blenderPath ?? undefined
        })
    }

    public hasCustomNodeFiles (): boolean {
        if (!this.exportPath) throw new Error('Missing or invalid export path')

        return existsSync(resolve('.', this.exportPath))
    }

    public setExportOptions (options: ExportOptions): this {
        const { groupItems, json, blenderPath } = options

        this.groupExportItems = groupItems ?? false

        if (blenderPath) this.blenderPath = this.resolvePath(blenderPath)
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

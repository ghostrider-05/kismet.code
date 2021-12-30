import { existsSync } from "fs"
import { resolve } from "path"

import { findClasses } from "../parser/index.js"

export class CustomNodesManager {
    public groupExportItems: boolean;

    public importPath: string | null = null;
    public exportPath: string;

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

    public async createCustomNodeFiles (): Promise<void> {
        if (!this.importPath) {
            this.importPath = ''
        }

        return await findClasses({
            importPath: this.importPath,
            exportPath: this.exportPath
        }, this.groupExportItems)
    }

    public hasCustomNodeFiles (): boolean {
        return existsSync(resolve('.', this.exportPath))
    }

    public setGroupExportItems (groupExportItems: boolean): this {
        this.groupExportItems = groupExportItems

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
}
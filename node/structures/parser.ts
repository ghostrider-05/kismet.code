import { existsSync } from "fs"
import { resolve } from "path"

import { findClasses } from "../parser/index.js"

export class CustomNodesManager {
    public groupExportItems: boolean;
    // TODO: expose properties and methods
    private importPath: string;
    private relativeFilePath: string;

    constructor (relativeFilePath: string) {
        this.importPath = ''
        this.relativeFilePath = relativeFilePath

        this.groupExportItems = false
    }

    public async createCustomNodeFiles (): Promise<void> {
        return await findClasses(this.groupExportItems)
    }

    public hasCustomNodeFiles (): boolean {
        return existsSync(resolve('.', this.relativeFilePath))
    }

    public setGroupExportItems (groupExportItems: boolean): this {
        this.groupExportItems = groupExportItems

        return this
    }

    private setImportPath (path: string): this {
        this.importPath = path

        return this
    }

    private setRelativeOutputPath (relativePath: string): this {
        this.relativeFilePath = relativePath

        return this
    }
}
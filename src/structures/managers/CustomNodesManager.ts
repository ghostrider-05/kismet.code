import { existsSync } from 'fs'
import { resolve } from 'path'

import { findClasses } from '../../parser/index.js'
import { _debug } from '../../parser/utils/options.js'
import { KismetError } from '../../shared/index.js'

import {
    ExportOptions,
    PathCreateOptions,
    PathInput
} from '../../types/index.js'

export class CustomNodesManager {
    public packages: string[] | undefined = undefined

    public importPath: string | null = null
    public exportPath: string | null = null

    public options: ExportOptions = {}

    private isPath (inputPath: string, absolute = true): boolean {
        return existsSync(absolute ? inputPath : this.resolvePath(inputPath))
    }

    private resolvePath (path: string): string {
        return !existsSync(path) ? resolve('.', path) : path
    }

    private get log () {
        return _debug(this.options.debug)
    }

    /**
     * Create / update custom class files with the set options
     */
    public async createCustomNodeFiles (): Promise<void> {
        if (!this.hasCustomNodeFiles() && this.options.debug) {
            this.log('Paths are not valid / existing...')

            if (!this.importPath)
                return this.log('Missing import path...', { error: true })
        }

        const paths: PathInput = {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            importPath: this.importPath!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            exportPath: this.exportPath!,
            packages: this.packages
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const completed = await findClasses(paths, this.options)
    }

    /**
     * Check if (valid) paths are set and exist
     */
    public hasCustomNodeFiles (): this is this & {
        importPath: string
        exportPath: string
    } {
        if (!this.exportPath) return false

        const validImportPath = this.importPath
            ? this.isPath(this.importPath)
            : false

        return this.isPath(this.exportPath, false) && validImportPath
    }

    /**
     * Customize the generated addon for kismet nodes in Blender
     * @param options The blender addon creator options
     */
    public setBlenderOptions (
        options: NonNullable<ExportOptions['blenderOptions']>
    ): this {
        if (!this.options.blender) {
            this.options.blender = true
        }

        this.options.blenderOptions = options

        return this
    }

    /**
     * Enable debugging while the classes are read
     */
    public setDebugOptions (enabled: boolean): this {
        this.options.debug = enabled

        return this
    }

    /**
     * Set all export options for extracting the custom classes
     * @param options
     */
    public setExportOptions (options?: ExportOptions): this {
        if (!options) this.options = {}
        else
            this.options = {
                ...this.options,
                ...options
            }

        return this
    }

    /**
     * Set the import path of the directory that holds the JSON files with information
     * about the custom classes.
     * @param path The absolute path of the folder
     */
    public setImportPath (path: string, options?: PathCreateOptions): this {
        if (!this.isPath(path) && options?.check) {
            new KismetError('INVALID_PATH', [path])
        }

        this.importPath = path

        return this
    }

    /**
     * Set the export path which will hold the exported classes and more
     * @param path The absolute (or relative) path to the export folder
     * @param options Path options:
     * - check: whether to check if the path is valid
     */
    public setExportPath (path: string, options?: PathCreateOptions): this {
        if (!this.isPath(path, false) && options?.check) {
            new KismetError('INVALID_PATH', [path])
        }

        this.exportPath = this.resolvePath(path)

        return this
    }

    /**
     * Only include classes from the packages. If no packages are set, all packages will be read.
     * @param names The names of the class packages (without file extension)
     */
    public setClassPackages (names: string[]): this {
        this.packages = names

        return this
    }
}

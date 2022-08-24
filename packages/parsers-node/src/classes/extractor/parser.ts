import { existsSync } from 'fs'
import { resolve } from 'path'

import { createLocalClasses } from './parser-function.js'

import type {
    LocalClassesCreateOptions,
    ExportOptions,
    PathCreateOptions,
} from './files.js'


export class LocalClassesParser {
    public options: LocalClassesCreateOptions

    constructor (options: LocalClassesCreateOptions) {
        this.options = options
    }

    protected validatePath (path: string | null | undefined, options?: { onlyAbsolute?: boolean }): void {
        if (!path || !existsSync(path)) {
            if (!options?.onlyAbsolute && path) {
                return this.validatePath(this.resolvePath(path))
            }
            throw new Error('Unknown path provided')
        }
    }

    public validatePaths (): void {
        this.validatePath(this.options.importPath)
        this.validatePath(this.options.exportPath)
    }

    public resolvePath (path: string): string | undefined {
        const resolvedPath = !existsSync(path) ? resolve('.', path) : path

        return existsSync(resolvedPath) ? resolvedPath : undefined
    }

    /**
     * Create / update custom class files with the set options
     */
    public async createLocalClasses (): Promise<void> {
        const completed = await createLocalClasses(this.options)

        if (!completed) console.log('Failed to complete task...')
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
    public setExportOptions (options?: LocalClassesCreateOptions): this {
        if (options) this.options = {
                ...this.options,
                ...options,
            }

        return this
    }

    /**
     * Set the import path of the directory that holds the JSON files with information
     * about the custom classes.
     * @param path The absolute path of the folder
     */
    public setImportPath (path: string, options?: PathCreateOptions): this {
        if (options?.check) {
            this.validatePath(path)
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.options.importPath = this.resolvePath(path)!

        return this
    }

    /**
     * Set the export path which will hold the exported classes and more
     * @param path The absolute (or relative) path to the export folder
     * @param options Path options:
     * - check: whether to check if the path is valid
     */
    public setExportPath (path: string, options?: PathCreateOptions): this {
        if (options?.check) {
            this.validatePath(path)
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.options.exportPath = this.resolvePath(path)!

        return this
    }

    /**
     * Only include classes from the packages. If no packages are set, all packages will be read.
     * @param names The names of the class packages (without file extension)
     */
    public setClassPackages (names: string[]): this {
        this.options.packages = names

        return this
    }
}

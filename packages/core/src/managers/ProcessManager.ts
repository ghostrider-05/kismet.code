import { KismetError } from '@kismet.ts/shared'

export class ProcessId {
    private readonly id: string
    private resolvedId: string

    constructor (id: string) {
        this.id = id
        this.resolvedId = this._read()
    }

    private _read (): string {
        return Buffer.from(this.id, 'base64').toString('utf-8')
    }

    private get resolved () {
        return ProcessId.readResolvedId(this.resolvedId)
    }

    public equals (id: string): boolean {
        return this.id === id
    }

    public equalIds (id: ProcessId): boolean {
        return ProcessId.equalIds(this, id)
    }

    public resolveId (): string {
        return this.resolvedId
    }

    public resolveName (): string {
        return this.resolved.name
    }

    public resolveIndex (): number {
        return this.resolved.count
    }

    public toString (): string {
        return this.id
    }

    public static readResolvedId (resolvedId: string): {
        name: string
        count: number
    } {
        const [name, count] = resolvedId.split('|')

        return {
            name,
            count: Number(count),
        }
    }

    public static equalIds (id: ProcessId, compareId: ProcessId): boolean {
        return id.id === compareId.id
    }
}

export type ProjectProcessOptions = {
    debug?: boolean
}

type ProjectProcess = {
    id: ProcessId
    name: string
    ids: Map<string, number>
    overwrittenIds: Map<string, number[]>
    options: ProjectProcessOptions
}

type ProcessIdOptions = { id?: ProcessId; index?: number }

class ProcessIdManager {
    public ids: Map<string, number> = new Map()
    public overwrittenIds: Map<string, number[]> = new Map()

    public processes: Record<string, ProjectProcess> = {}

    protected _getIds<T extends boolean = false> (
        id?: ProcessId,
        overwrittendIds?: T
    ): Map<string, T extends true ? number[] : number> {
        const base = this.getProject(id) ?? this
        const property = overwrittendIds ? 'overwrittenIds' : ('ids' as const)

        return base[property] as Map<string, T extends true ? number[] : number>
    }

    protected _validateIndex (Class: string, options?: ProcessIdOptions) {
        if (options?.index == undefined) return
        const { index, id } = options

        const ids = this._getIds(id, true).get(Class)

        if (
            ids?.includes(options.index) ||
            this._getIds(id).get(Class) === options.index
        ) {
            new KismetError('INDEX_DEFINED')
        }

        this._getIds(id, true).set(Class, [...(ids ?? []), index])
    }

    protected createId (id: string) {
        const buffer = Buffer.from(id).toString('base64')

        return new ProcessId(buffer)
    }

    protected getProject (id?: ProcessId): ProjectProcess | undefined {
        const projectName = id?.resolveId().split('|')[1]

        return (
            this.processes[projectName ?? ''] ??
            (Object.keys(this.processes).length > 0
                ? this.processes[Object.keys(this.processes)[0]]
                : undefined) ??
            undefined
        )
    }
}

class ProcessDataManager extends ProcessIdManager {
    public attachProject (
        name: string,
        options?: ProjectProcessOptions
    ): ProcessId {
        const id = this.createId(`project|${name}`)
        if (this.processes[name]) new KismetError('PROJECT_DEFINED')

        this.processes[name] = {
            id,
            name,
            options: options ?? {},
            ids: new Map(),
            overwrittenIds: new Map(),
        }

        return id
    }

    /**
     * Debug information
     * @param input The string input
     * @param id The project id of the sequence / item
     * @returns If succeeded, whether the attached project was found or not
     */
    public debug (
        input: string,
        id?: ProcessId
    ): { content: string; completed: boolean } | undefined {
        const project = this.getProject(id)
        if (!project?.options.debug) return

        const content = `[${project.name}] ` + input

        console.log(content)

        return {
            content,
            completed: true,
        }
    }

    public id (Class: string, options?: ProcessIdOptions): ProcessId {
        const { id, index } = options || {}

        const count = this._getIds(id).get(Class)
        const newCount = count != undefined ? count + 1 : 1

        if (index == undefined) this._getIds(id).set(Class, newCount)
        this._validateIndex(Class, options)

        return this.createId(`${Class}|${index ?? newCount}`)
    }
}

export const ProcessManager = new ProcessDataManager()

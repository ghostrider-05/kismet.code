export class ProcessId {
    private readonly id: string

    constructor (id: string) {
        this.id = id
    }

    public equals (id: string): boolean {
        return this.id === id
    }

    public resolveId (): string {
        return Buffer.from(this.id, 'base64').toString('utf-8')
    }
}

export const ProcessManager = new class ProcessManager {
    private ids: Map<string, number>

    constructor () {
        this.ids = new Map()
    }

    private createId (id: string) {
        const buffer = Buffer.from(id).toString('base64')

        return new ProcessId(buffer)
    }

    public id (Class: string): ProcessId {
        const count = this.ids.get(Class)

        this.ids.set(Class, count != undefined ? count + 1 : 0)

        return this.createId(`${Class}|${count ?? 0}`)
    }
}
import { Constants } from "../shared/index.js"
import { ProcessOptions } from "../types/options.js"

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

/**
 * Internal class used for handling connections and output 
 */
export const ProcessManager = new class ProcessManager {
    private ids: Map<string, number>
    private overwrittenNumbers: Map<string, number[]>

    private logLevel: Constants.LogLevel
    private overwriteErrors: boolean
    
    constructor () {
        this.ids = new Map()
        this.overwrittenNumbers = new Map()

        this.logLevel = Constants.LogLevel.ALL
        this.overwriteErrors = false
    }

    private createId (id: string) {
        const buffer = Buffer.from(id).toString('base64')

        return new ProcessId(buffer)
    }

    private get throwError (): boolean {
        if (this.overwriteErrors) {
            return true
        }

        return this.logLevel <= Constants.LogLevel.ERRORS
    }

    /**
     * Create a new id for a given class. 
     * The id can then be resolved into a name for linking nodes
     */
    public id (Class: string, number?: number): ProcessId {
        const count = this.ids.get(Class)

        if (number != undefined) {
            const numbers = this.overwrittenNumbers.get(Class)
            if (!numbers?.some(n => n === number)) {
                this.overwrittenNumbers.set(Class, (numbers ?? []).concat(number))
            } else {
                throw new Error('Cannot have multiple items of the same class with the same id')
            }
        } 

        this.ids.set(Class, count != undefined ? count + 1 : 0)

        return this.createId(`${Class}|${count ?? 0}`)
    }

    /**
     * Log output information  
     * @param text The text to log
     * @param channel The process channel: stdout or stderr
     */
    public log (text: string, channel: 'out' | 'error' = 'out'): void {
        switch (channel) {
            case 'out': 
                if (this.logLevel <= Constants.LogLevel.DEBUG) process.stdout.write(text)
                break
            case 'error':
                if (this.throwError) process.stderr.write(text)
                break
            default: 
                if (this.throwError) {
                    process.stderr.write('Unknown log channel: ' + channel)
                }
        }
    }

    /**
     * Change the behaviour for handling errors and logging events
     */
    public setLogOptions (options: ProcessOptions): void {
        this.logLevel = options.logLevel ?? Constants.LogLevel.ALL

        this.overwriteErrors = options.throwOnError ?? false
    }
}
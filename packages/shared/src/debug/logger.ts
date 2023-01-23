export type LogHandlerReturnType = 
    | 'completed'
    | 'error'
    | 'log'

export type LogHandlerStream = 
    | 'stdout'
    | 'stderr'
    | 'http'

export interface LoggerOptions {
    levels: (
        | string 
        | LogLevel
    )[]
}

export interface LogOptions {
    level?: string
}

export interface LogLevel { 
    type: string
    default?: boolean
    prefix?: string
    stream?: LogHandlerStream
    format?: (message: string) => string
    handler?: (message: string) => Promise<void | LogHandlerReturnType>
}

export class Logger {
    /**
     * Whether to enable the logger
     * @default true
     */
    public static enabled = true

    public options: LoggerOptions

    public defaultLevel: LogLevel | undefined = undefined

    constructor (options: LoggerOptions) {
        this.validateOptions(options)

        this.options = options
    }

    private validateOptions (options: LoggerOptions): void {
        for (const level of options.levels) {
            if (typeof level === 'string') continue

            if (level.default) this.setDefaultLevel(level)
        }
    }

    private setDefaultLevel (level: LogLevel): void {
        if (this.defaultLevel != undefined) {
            throw new Error('Default log level is already set: ' + JSON.stringify(this.defaultLevel))
        }

        this.defaultLevel = level
    }

    private getLevelOptions (level?: string): LogLevel | undefined {
        const logLevel = this.options.levels.find(logLevel => {
            return typeof logLevel !== 'string' ? logLevel.type === level : false
        }) as LogLevel | undefined 

        return logLevel ?? this.defaultLevel
    }

    public async log (message: string, options?: LogOptions): Promise<void> {
        if (!Logger.enabled) return
        const level = this.getLevelOptions(options?.level)

        if (level?.stream === 'http') {
            const output = await level.handler?.(message)

            if (output === 'log' || output === 'error') {
                const msg = `Failed to complete remote logging: ${message}`
                process[output === 'log' ? 'stdout' : 'stderr'].write(msg)
            }

            return
        }

        const msg = (level?.prefix ?? '') + (level?.format?.(message) ?? message)
        process[level?.stream ?? 'stdout'].write(msg)
    }
}

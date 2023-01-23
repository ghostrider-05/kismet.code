import { Messages, MessageKey, MessageParams } from './Messages.js'

function message<T extends MessageKey> (key: T, ...args: MessageParams<T>) {
    if (typeof key !== 'string' || !(key in Messages)) {
        throw new Error('Invalid error key provided: ' + key)
    }

    const message = Messages[key]

    if (typeof message !== 'string') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return message(...args)
    } else {
        return message
    }
}

/**
 * Util class for throwing common errors
 */
export class KismetError<T extends MessageKey, Params extends MessageParams<T> = MessageParams<T>> {
    /**
     * Default messages for the error
     */
    public static Messages = Messages

    /**
     * Define a new message for throwing errors
     * @param key The key for the error. Used as `new KismetError('your_key')`
     * @param value The function or message assiocated with the key
     */
    public static addMessage (key: string, value: string | Function): void {
        KismetError.Messages = Object.defineProperty(KismetError.Messages, key, value)
    }

    constructor (
        key: T,
        args?: Params,
        options?: {
            error?: boolean
            cause?: Error
            data?: Record<string, unknown>
        }
    ) {
        const _message = message(
            key,
            ...(args ?? ([] as MessageParams<T>))
        ).concat(options?.data ? `\n${JSON.stringify(options.data)}` : '')
        const disableError =
            'error' in (options ?? {}) && options?.error === false

        if (disableError) {
            process.stdout.write(_message)
            return
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const error = new Error(_message, { cause: options?.cause })

            throw error
        }
    }
}

export type {
    MessageKey,
    MessageParams
}

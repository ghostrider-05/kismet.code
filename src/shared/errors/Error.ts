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

export class KismetError<T extends MessageKey> {
    static Messages = Messages

    constructor (
        key: T,
        args?: MessageParams<T>,
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

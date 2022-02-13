import { Messages } from './Messages.js'

function message (key: keyof typeof Messages, ...args: string[]) {
    if (typeof key !== 'string' || !(key in Messages)) {
        throw new Error('Invalid error key provided: ' + key)
    }

    const message = Messages[key]

    if (typeof message === 'function') {
        return message(...args)
    } else return message
}

export class KismetError {
    public message: string 

    constructor (key: string, args?: string[], error?: boolean) {
        this.message = message(key, ...(args ?? []))

        if (error) throw new Error(this.message)
        else process.stdout.write(this.message)
    }
}

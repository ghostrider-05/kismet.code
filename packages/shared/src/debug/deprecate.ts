export type DeprecateFunction = (fn: Function, msg: string, code?: string) => void

export function browserDeprecate (...args: Parameters<DeprecateFunction>) {
    const [fn, msg] = args
    let warned = false

    function deprecate () {
        if (!warned) {
            console.warn(msg)
            warned = true
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // eslint-disable-next-line prefer-rest-params
        return fn.apply(this, arguments)
    }

    return deprecate
}
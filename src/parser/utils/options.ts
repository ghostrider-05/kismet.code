import type { ExportOptions } from '../../types/index.js'

export const defaultOptions: Required<ExportOptions> = {
    debug: false,
    blender: false,
    groupItems: true,
    json: false,
    blenderOptions: {},
    classes: false,
    types: ['actions', 'conditions', 'events', 'variables']
}

export const _defaultExportOptions = (
    rawOptions?: ExportOptions
): Required<ExportOptions> => {
    if (!rawOptions) return defaultOptions

    return Object.keys(defaultOptions)
        .map(key => {
            const value = rawOptions[key] ?? defaultOptions[key]

            return [key, value] as string[]
        })
        .reduce(
            (prev, [key, value]) => ({
                ...prev,
                [key]: value
            }),
            {} as Required<ExportOptions>
        )
}

export interface DebugOptions {
    error?: boolean
}

export const _debug =
    (enabled?: boolean) => (content: string, options?: DebugOptions) => {
        if (!enabled) return

        if (options?.error) {
            throw new Error(content)
        }

        console.log(`[Class parser] ${content}`)
    }

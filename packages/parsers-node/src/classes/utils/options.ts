import type { ExportOptions } from '../extractor/files.js'

export const defaultOptions: Required<ExportOptions> = {
    debug: false,
    blender: false,
    groupItems: true,
    json: false,
    blenderOptions: {},
    classes: false,
    writeIndexFile: true,
    version: null,
    classVersion: {},
    types: ['actions', 'conditions', 'events', 'variables'],
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
                [key]: value,
            }),
            {} as Required<ExportOptions>
        )
}

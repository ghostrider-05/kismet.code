import { groupByProperty } from '@kismet.ts/shared'

import type { JsonFile } from '../extractor/files.js'

const importStatement = (name: string) => {
    return `import { ${name} } from './Classes/${name}.js'`
}

const exportStatement = (
    classes: JsonFile[],
    options: { groupItems: boolean; items: string[] }
) => {
    const groupExport = options.groupItems
        ? groupByProperty(classes, 'Package')
              .map(items => {
                  return `export const ${items[0].Package} = {\n\t${items
                      .map(n => n.name)
                      .join(',\n\t')}\n}`
              })
              .join('\n')
        : ''

    return `\n\nexport {\n\t${options.items.join(',\n\t')}\n}\n\n${groupExport}`
}

export function getExportFile (
    classes: JsonFile[],
    groupItems: boolean
): string {
    if (classes?.length === 0) return ''

    const classNames = classes.map(item => item.name)

    const content = classNames
        .map(importStatement)
        .concat(
            '\n',
            exportStatement(classes, {
                groupItems,
                items: classNames,
            })
        )
        .join('\n')

    return content
}

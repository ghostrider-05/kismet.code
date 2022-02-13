import { writeFile as writeToFile } from "fs/promises"

import { 
    filterEmptyLines, 
    groupByProperty, 
    t 
} from "../../shared/index.js"

import type { 
    JsonFile 
} from "../../types/index.js"

export const writeFile = async (path: string, content: string): Promise<void> => {
    return await writeToFile(path, filterEmptyLines(content), { encoding: 'utf8' })
}

export function getExportFile (classes: JsonFile[], groupItems: boolean): string {
    const importStatement = (name: string) => `import { ${name} } from './Classes/${name}.js'`

    const exportStatement = (items: (string | JsonFile)[]) => {
        const groupExport = groupItems ? groupByProperty(classes, 'Package').map(items => {
            return `export const ${items[0].Package} = {\n\t${items.map(n => n.name).join(',\n\t')}\n}`
        }).join('\n') : ''
        
        return `\n\nexport {\n\t${t<string[]>(items).join(',\n\t')}\n}\n\n${groupExport}`
    }

    if (classes?.length === 0) return '';

    const classNames = classes.map(item => item.name)

    const content = classNames.map(importStatement)
        .concat('\n', exportStatement(classNames))
        .join('\n')

    return content
}

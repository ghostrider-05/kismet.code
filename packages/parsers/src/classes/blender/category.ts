import { groupByProperty } from '@kismet.ts/shared'
import type {
    UnrealJsonReadFileNode,
} from '../extractor/files.js'

export const nodeCategories = (categories: Record<string, string[]>) => {
    return Object.keys(categories)
        .map(key => {
            const itemList = categories[key]
                .map(item => {
                    return `        NodeItem("${item}")`
                })
                .join(',\n')

            return `    KismetNodeCategory('${key.toUpperCase()}', "${key}", items=[\n${itemList}])`
        })
        .join(',\n')
}

export const nodeCategoryClasses = (categories: Record<string, string[]>) => {
    return Object.keys(categories)
        .map(key => {
            return categories[key].map(value => '    ' + value).join(',\n')
        })
        .join(',\n')
}

export const createCategories = (nodes: UnrealJsonReadFileNode[]) => {
    return groupByProperty(nodes, 'type')
        .map(items => {
            return {
                [items[0].type]: items.map(item => item.Class),
            }
        })
        .reduce((prev, curr) => ({ ...prev, ...curr }), {})
}

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

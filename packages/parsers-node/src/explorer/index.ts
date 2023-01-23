import { loadTree } from './load.js'
import { logTree } from './log.js'
import { searchClasses, ClassSearchOptions } from './tree.js'

export interface TreeLogCreateOptions extends ClassSearchOptions {
    path: string
    logSuperClasses?: boolean
}

export function createTreeLog (options: TreeLogCreateOptions): void {
    const nodes = loadTree(options.path)
    const items = searchClasses(nodes, options)
    logTree(items, options.logSuperClasses)
}

export { createRecursiveTree } from './nested.js'
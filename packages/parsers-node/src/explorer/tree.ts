import { RawUnrealJsonFile, RawUnrealJsonVariable } from "../classes/index.js";

export interface ClassSearchOptions {
    className: string
    properties?: string[]
}

// TODO: remove
export function getSuper (name: string, items: (RawUnrealJsonFile)[]) {
    const Extends = items.find(i => i.name === name)?.extends
    const Classes = [name]
    let latests: string | undefined = Extends

    const isExtending = (name?: string) =>
        name != undefined && name !== 'Object'
    const extendingClasses = (list: string[]) =>
        list.concat(latests ? [latests] : [])

    if (!isExtending(Extends)) return extendingClasses(Classes)

    while (isExtending(latests)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Classes.push(latests!)

        latests = items.find(i => i.name === latests)?.extends
    }

    return extendingClasses(Classes)
}

function get (nodes: RawUnrealJsonFile[], className: string) {
    const base = nodes.find(x => x.name === className);
    if (!base) throw new Error('Unknown class: ' + className);

    return [
        base, 
        ...getSuper(className, nodes).map(name => nodes.find(n => n.name === name))
    ].filter((n): n is NonNullable<typeof n> => { return n != undefined })
}

export function searchClasses (nodes: RawUnrealJsonFile[], options: ClassSearchOptions) {
    const base = get(nodes, options.className);

    if (!options.properties || options.properties.length === 0)
        return base
    else {
        let index = 0
        let c_nodes = base
        let last_var: RawUnrealJsonVariable | undefined = undefined

        while (index < options.properties.length) {
            const prop = options.properties.at(index);
            last_var = c_nodes.find(x => x.variables.some(x => x.name === prop))?.variables.find(x => x.name === prop)

            if (!prop || !last_var) throw new Error('Invalid property on node: ' + prop)

            c_nodes = get(nodes, last_var.type)

            index++
        }

        return c_nodes
    }
}

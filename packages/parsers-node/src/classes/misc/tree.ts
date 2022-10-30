import { UnrealJsonReadFileNode } from "../extractor/index.js";

import { getSuperClasses } from "../utils/ClassManager.js";

export interface BaseClassTreeVariable {
    name: string
    type: string
    parent: string
}

export interface StaticChildClassTreeVariable extends BaseClassTreeVariable {
    children: false
    variables: undefined
}

export interface StaticParentClassTreeVariable extends BaseClassTreeVariable {
    variables: (StaticChildClassTreeVariable | StaticParentClassTreeVariable)[]
    children: true
}

export type StaticClassTreeVariable = 
    | StaticParentClassTreeVariable
    | StaticChildClassTreeVariable

export interface KismetClassTreeItem {
    name: string
    variables: BaseClassTreeVariable[]
}

export interface KismetClassTreeFillOptions {
    delimiter?: string
    firstClass?: string
    ignoreErrors?: boolean
    results?: {
        max?: number
        exact?: boolean
    }
}

export class KismetClassTree {
    constructor (public nodes: UnrealJsonReadFileNode[]) {

    }

    private staticTypes: string[] = []

    private addStaticType (type: string) {
        if (!this.staticTypes.includes(type) && this.nodes.some(n => n.Class === type)) this.staticTypes.push(type)
    }

    public get staticNodes (): UnrealJsonReadFileNode[] {
        return this.staticTypes
            .map(t => this.nodes.find(n => n.Class === t)!)
            .filter(n => n)
    }

    private searchVariable (v: BaseClassTreeVariable[] | undefined, max: number, index = 0): StaticClassTreeVariable[] | undefined {
        this.staticTypes = []
        const child = (item: BaseClassTreeVariable): StaticChildClassTreeVariable => {
            this.addStaticType(item.type)

            return {
                ...item,
                children: false,
                variables: undefined
            }
        }

        return v?.map(w => {
            if (index < max) {
                const vars = this.searchVariable(this.find(w.name)?.variables, max, index + 0)

                if (vars) {
                    this.addStaticType(w.type)

                    return {
                        children: true,
                        variables: vars,
                        ...w
                    } as StaticParentClassTreeVariable
                } else return child(w)
            } else {
                return child(w)
            }
        }) ?? undefined
    }

    public createStaticTree (className: string, depth: number) {
        return this.searchVariable(this.find(className)?.variables, depth)
    }

    public formatVariables (node: UnrealJsonReadFileNode | undefined): BaseClassTreeVariable[] | undefined {
        return node?.variables.map(v => {
            return {
                name: v.name,
                type: v.type,
                parent: node.Class
            }
        })
    }

    public fill (path: string, options?: KismetClassTreeFillOptions) {
        const [className, ...items] = path.split(options?.delimiter ?? '.');
        const last = items.at(-1) ?? '', names = items.slice(0, -1);

        const variables = this.find(options?.firstClass ?? className)
        if (!variables) return;
        let lastVariables: BaseClassTreeVariable[] = variables.variables, completed = true;

        for (const name of names) {
            const type = lastVariables.find(x => x.name === name)?.type
            if (!type) {
                completed = false;

                if (options?.ignoreErrors) break
                else throw new Error(`Unknown variable ${name} on ${className}`)
            }

            const newClass = this.find(type)
            if (!newClass) {
                completed = false;

                if (options?.ignoreErrors) break
                else throw new Error(`Unknown class ${type} for variable ${className}`)
            }

            lastVariables = newClass.variables
        }

        if (!completed) return

        if (options?.results?.exact) return lastVariables.find(x => x.name === last)
        else if (options?.results?.max != undefined) {
            const { max } = options.results;
    
            return lastVariables.filter(({ name }) => {
                return name.toLowerCase() === last.toLowerCase() 
                    || name.toLowerCase().includes(last.toLowerCase())
            }).filter((_, i) => i < max)
        }
    }

    public find (className: string): KismetClassTreeItem | undefined {
        const node = this.nodes.find(x => x.Class === className)
        if (!node) return;
        const supers = getSuperClasses(className, this.nodes)

        const variables = supers
            .map(x => this.formatVariables(this.nodes.find(n => n.Class === x)))
            .concat(this.formatVariables(node))
            .filter(n => n != undefined)
            .flat() as BaseClassTreeVariable[];

        return {
            name: className,
            variables
        }
    }

    public findVariable (variable: BaseClassTreeVariable) {
        const item = this.nodes.find(n => n.Class === variable.parent)

        return item?.variables.find(x => x.name === variable.name)
    }
}

interface Defaultproperty {
    name:   string;
    value?: string;
}

interface Structure {
    name:       string;
    properties: Variable[];
}

interface Variable {
    flags:        string;
    name:         string;
    type:         string;
    replicated:   'True' | 'False';
    category:     null | string;
    description?: string;
}

interface UnrealClass {
    name:              string;
    Class:             string;
    Extends:           string;
    structures:        Structure[];
    Package:           string;
    placeable:         boolean;
    enums:             { [key: string]: string[] };
    variables:         Variable[];
    defaultproperties: Defaultproperty[];
    archetype:         string;
}

type CompactUnrealTreeClass = Omit<UnrealClass, 
    | 'Class'
    | 'placeable' 
    | 'archetype' 
    | 'enums' 
    | 'structures'
    | 'defaultproperties'
    | 'variables'
> & {
    parents: string[]
    variables: {
        name:         string;
        type:         string;
        is_parent:       boolean;
        // count?: number;
        replicated?:  boolean;
        category?:    string;
        description?: string;
        defaultValue?:string;
    }[]
}

type CompactUnrealClass = Omit<CompactUnrealTreeClass, 'parents'>

function getSuperClasses (
    name: string, 
    items: UnrealClass[],
) {
    const Extends = items.find(i => i.name === name)?.Extends
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

        latests = items.find(i => i.name === latests)?.Extends
    }

    return extendingClasses(Classes)
}

export function compactClass (cls: UnrealClass, classes: UnrealClass[]): CompactUnrealClass {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { placeable, archetype, enums, defaultproperties, variables, structures, Class, ...out } = cls

    return {
        ...out,
        variables: variables.map(variable => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { replicated, category, flags, ...v } = variable
            const output: CompactUnrealClass['variables'][number] = {
                ...v,
                is_parent: classes.some(c => c.Class === v.type),
                // parent: cls.Class
            }

            const defaultValue = defaultproperties.find(x => x.name === v.name)?.value

            if (output.type.startsWith('array<') && output.type !== 'array< class >' && output.type.includes(' ')) {
                output.type = 'array<' + output.type.split(' ').filter(n => n.trim().length > 0).at(-1)
            }

            if (defaultValue) output.defaultValue = defaultValue
            if (category != null) output.category = category
            if (replicated === 'True') output.replicated = true

            return output;
        })
    }
}

class TreeUtil {
    private found: CompactUnrealTreeClass[] = []

    public constructor (private classes: UnrealClass[]) {}

    private getNames (...names: string[]) {
        return this.classes.filter(c => names.includes(c.Class))
    }

    private to (cls: UnrealClass): CompactUnrealTreeClass {
        const parents = getSuperClasses(cls.name, this.classes)
        const compact = compactClass(cls, this.classes)

        return { ...compact, parents }
    }

    public get (type: string) {
        if (this.found.some(f => f.name === type)) return
        return this.classes.find(x => x.Class === type)
    }

    public get foundItems () {
        return this.found
    }

    public convert (cls: UnrealClass): CompactUnrealTreeClass[] {
        const compact = this.to(cls), parents = compact.parents
        return [compact, ...this.getNames(...parents).map(c => this.to(c))]
    }

    public addCompact (...items: CompactUnrealTreeClass[]) {
        for (const item of items) {
            if (!this.found.some(f => f.name === item.name)) {
                this.found.push(item)
            }
        }
    }

    public add (...items: (UnrealClass | undefined)[]) {
        const filtered = items
            .filter((c): c is NonNullable<typeof c> => c != undefined)
            .map(c => this.to(c))

        this.addCompact(...filtered)
    }
}

interface CompactTreeOptions<T> {
    classes: UnrealClass[]
    className: string
    depth: number
    metadata: T
}

type CompactTree<T> = T & {
    name: string
    depth: number
    classes: CompactUnrealTreeClass[]
}

export function createCompactRecursiveTree <T> (options: CompactTreeOptions<T>): CompactTree<T> {
    const { className, classes, depth, metadata } = options

    const base = classes.find(c => c.Class === className)
    if (!base) throw new Error('Unknown base class ' + className)

    const util = new TreeUtil(classes)

    const getChildren = (util: TreeUtil, cls: UnrealClass, d: number) => {
        const compact = util.convert(cls)
        util.addCompact(...compact)

        for (const variable of compact.flatMap(c => c.variables)) {
            const varClass = util.get(variable.type)
            if (d <= depth && varClass != undefined) {
                getChildren(util, varClass, d + 1)
            }
        }
    }

    getChildren(util, base, 0)

    const uniqueFound = [...new Set(util.foundItems.map(x => x.name))]
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map(name => util.foundItems.find(x => x.name === name)!)

    return {
        name: className,
        depth,
        ...metadata,
        classes: uniqueFound,
    }
}

export function buildCompactTree <T> (tree: CompactTree<T>) {
    function getChildren (item: CompactUnrealTreeClass['variables'][number], tree: CompactTree<T>) {
        const cls = tree.classes.find(x => x.name === item.type)!
        return [cls].concat(...tree.classes.filter(c => cls.parents.includes(c.name)))
            .flatMap(x => x.variables.map(v => ({ ...v, parent: { name: x.name, Package: x.Package }})))
    }

    const cls = tree.classes.find(x => x.name === tree.name)!

    return {
        name: tree.name,
        getChildren,
        children: [cls].concat(...tree.classes.filter(c => cls.parents.includes(c.name)))
            .flatMap(x => x.variables.map(v => ({ ...v, parent: { name: x.name, Package: x.Package }}))),
    }
}

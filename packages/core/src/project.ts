import { ClassConstructor, cast, indent } from '@kismet.ts/shared'

import { BaseSequenceItem } from './item/index.js'
import {
    projectOptions,
    Sequence,
    SequencePositionOptions,
    SchemaItemNames,
    SequenceItemTypeof,
    KismetTreeOverview,
} from './structures/index.js'

import { ProcessManager, ProcessId } from './managers/index.js'
import { KismetSceneObject } from './util/index.js'

type IStoreInputValue<T extends IStoreValue<SequenceItemTypeof>> = T extends SequenceItemTypeof ? T : never
export type IStoreValue<T extends SequenceItemTypeof> = T | { [x: string]: T }

export type IStore<
    T extends IStoreValue<SequenceItemTypeof> = SequenceItemTypeof
> = Record<string, IStoreValue<IStoreInputValue<T>>>
export type ISingleStore<T extends typeof BaseSequenceItem = SequenceItemTypeof> = Record<string, T>

export enum ProjectSearchScope {
    Items,
    Sequence,
    Level,
    All,
}

export enum ProjectSearchType {
    CommentsAndNames,
    ObjectTypes,
}

export interface ProjectSearchOptions {
    query: string
    scope?: ProjectSearchScope
    type?: ProjectSearchType
    items?: ProcessId[]
}

export class KismetFile {
    public readonly id: ProcessId

    /**
     * The main sequence that is attached to this project
     */
    public mainSequence: Sequence

    /**
     * The name of the kismet project.
     * Can be found as the .udk name / map name.
     */
    public projectName: string

    /**
     * Layout options for positioning kismet nodes
     */
    public layout?: SequencePositionOptions<SchemaItemNames>

    /**
     * The sequences of streamed levels in this project that will be connected to this file.
     */
    public streamedLevels?: KismetFile[]

    private sceneObjects: KismetSceneObject[] = []

    constructor (options: projectOptions<SchemaItemNames>) {
        const { projectName, layout } = options

        this.projectName = projectName
        this.id = ProcessManager.attachProject(projectName, options)

        this.layout = layout

        this.mainSequence = new Sequence({
            name: 'Main_Sequence',
            layout: this.layout,
            mainSequence: true,
            project: this.id,
        })
    }

    /**
     * Convert nodes to an array of items
     * @see {@link KismetFile.listDefaultItems} to list the default items
     * @param input An object that holds the custom items
     * @returns The converted array of items
     * @example
     * const items = KismetFile.listItems({
     *  Actions: {
     *      MyAction
     *  }
     * }) // [MyAction]
     * @example
     * const items = KismetFile.listItems({
     *  Actions: {
     *      MyAction,
     *      MyCategory: {
     *          TestAction
     *      }
     *  }
     * }) // [MyAction]
     */
    public static listItems<T extends SequenceItemTypeof> (
        input: Partial<Record<
            'Actions' | 'Conditions' | 'Events' | 'Variables',
            IStore
        >>
    ): SequenceItemTypeof[] {
        const items = Object.keys(input).flatMap(key => {
            const category = input[key as keyof typeof input]
            if (!category) return []

            const classes = Object.keys(category)
                .filter(cKey => {
                    const Class = category[cKey as keyof typeof category] as
                        | IStore<SequenceItemTypeof>

                    const isInstance = Class instanceof BaseSequenceItem
                    if (isInstance) return true

                    try {
                        return (
                            new (cast(Class) as ClassConstructor)() instanceof
                            BaseSequenceItem
                        )
                    } catch {
                        /** */
                    }
                })
                .map(name => category[name as keyof typeof category] as T)

            return classes
        })

        return items
    }

    /**
     * Log data in a project to the console
     * @returns if the input was logged
     */
    public static debug (input: string, projectId: ProcessId): boolean;
    /** @deprecated */
    public static debug (input: string, project: KismetFile): boolean;
    public static debug (input: string, project: KismetFile | ProcessId): boolean {
        const projectId = project instanceof KismetFile ? project.id : project
        return ProcessManager.debug(input, projectId)?.completed ?? false
    }

    /**
     * Log text to the console if the 'debug' option in this project is enabled
     * @param input 
     */
    public debug (input: string): void {
        KismetFile.debug(input, this.id)
    }

    /**
     * Logs an overview of this project with the subsequences
     * 
     * Can be found in UDK in the `Sequences` window
     */
    public debugSequences (): void {
        const logLevel = (level: KismetTreeOverview, depth: number): void => {
            console.log(indent(depth) + (level.mainSequence ? `${this.projectName} - ${Sequence.name}` : level.name) + ` [${level.items}]`)
            if (level.subSequences) {
                for (const sub of level.subSequences) {
                    logLevel(sub, depth + 1)
                }
            }
        }

        const tree: KismetTreeOverview = {
            name: 'Sequences',
            items: 1,
            subSequences: [this.mainSequence.util.createTree()]
        }

        logLevel(tree, 0)
    }

    /**
     * Search for an item in the selected scope
     * Returns the matched items
     */
    private search (options: ProjectSearchOptions) {
        const scope = options.scope ?? ProjectSearchScope.Sequence
        const type = options.type ?? ProjectSearchType.CommentsAndNames

        this.debug(`Searching in ${scope} on ${type}: ${options.query}`)
    }

    public toString (): string {
        return this.mainSequence.toString()
    }
}

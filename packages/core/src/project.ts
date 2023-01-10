import { ClassConstructor, cast } from '@kismet.ts/shared'

import { BaseSequenceItem } from './item/index.js'
import {
    projectOptions,
    Sequence,
    SequencePositionOptions,
    SchemaItemNames,
    SequenceItemTypeof,
} from './structures/index.js'

import { ProcessManager, ProcessId } from './managers/index.js'

type IStoreInputValue<T extends IStoreValue<SequenceItemTypeof>> = T extends SequenceItemTypeof ? T : never
export type IStoreValue<T extends SequenceItemTypeof> = T | { [x: string]: T }

export type IStore<
    T extends IStoreValue<SequenceItemTypeof> = SequenceItemTypeof
> = Record<string, IStoreValue<IStoreInputValue<T>>>
export type ISingleStore<T extends typeof BaseSequenceItem = SequenceItemTypeof> = Record<string, T>

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
        input: Record<
            'Actions' | 'Conditions' | 'Events' | 'Variables',
            IStore
        >
    ): SequenceItemTypeof[] {
        const items = Object.keys(input).flatMap(key => {
            const category = input[key as keyof typeof input]

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
    public static debug (input: string, project: KismetFile): boolean {
        return ProcessManager.debug(input, project.id)?.completed ?? false
    }

    /**
     * Log text to the console if the 'debug' option in this project is enabled
     * @param input 
     */
    public debug (input: string): void {
        KismetFile.debug(input, this)
    }

    private debugSequences (): void {
        /**
         * Logs the levels + their subsequences
         */
    }

    private search (input: string, type: string, scope: 'sequence' | 'level' | 'all') {
        /**
         * Search for an item in the selected scope
         * Returns the matched items
         */

        this.debug(`Searching in ${scope} on ${type}: ${input}`)
    }

    public toString (): string {
        return this.mainSequence.toString()
    }
}

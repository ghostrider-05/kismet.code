import { ClassConstructor, cast } from '@kismet.ts/shared'

import { BaseSequenceItem } from './item/index.js'
import {
    projectOptions,
    Sequence,
    SequencePositionOptions,
    SchemaItemNames,
    SequenceItemType
} from './structures/index.js'

import { ProcessManager, ProcessId } from './managers/index.js'

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
    public static listItems<T extends SequenceItemType> (
        input: Record<
            'Actions' | 'Conditions' | 'Events' | 'Variables',
            Record<string, SequenceItemType | Record<string, SequenceItemType>>
        >
    ): SequenceItemType[] {
        const items = Object.keys(input).flatMap(key => {
            const category = input[key as keyof typeof input]

            const classes = Object.keys(category)
                .filter(cKey => {
                    const Class = category[cKey as keyof typeof category] as
                        | BaseSequenceItem
                        | Record<string, BaseSequenceItem>

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

    public toString (): string {
        return this.mainSequence.toString()
    }
}

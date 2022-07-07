import {
    BaseSequenceItem,
    Comment,
    CommentFrame,
    Sequence,
} from './Sequence/index.js'

import { Variables, Actions, Conditions, Events } from '../items/index.js'

import { ProcessManager, ProcessId } from './managers/index.js'

import { cast, clipboard } from '../shared/index.js'

import type {
    ClassConstructor,
    projectOptions,
    SchemaItemNames,
    SequenceItemType,
    SequencePositionOptions,
} from '../types/index.js'

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
     * Default Rocket League nodes (actions, conditions, events) + default UDK nodes
     * @version 2.13
     */
    public static Items = {
        Actions,
        Conditions,
        Variables,
        Events,

        Comment,
        CommentFrame,
    }

    /**
     * Convert the default items ({@link KismetFile.Items}) to an array of items
     * @returns The converted nodes
     */
    public static listDefaultItems () {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Comment, CommentFrame, ...input } = KismetFile.Items

        return KismetFile.listItems(<never>input)
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
            Exclude<
                keyof typeof KismetFile['Items'],
                'Comment' | 'CommentFrame'
            >,
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

    /**
     * Copy any kismet node to the clipboard
     * @param item The item to copy
     */
    public static async copy (item: SequenceItemType): Promise<void> {
        const input = item.toString()

        return await clipboard.write(input)
    }

    /**
     * Copy this project kismet file to the clipboard.
     * Copies {@link KismetFile.toString}.
     */
    public async copyKismet (): Promise<void> {
        return await clipboard.write(this.toString())
    }

    public toString (): string {
        return this.mainSequence.toString()
    }
}

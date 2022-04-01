import { Comment, CommentFrame, Sequence } from './Sequence/index.js'

import { Variables, Actions, Conditions, Events } from '../items/index.js'

import {
    CustomNodesManager,
    ProcessManager,
    ProcessId
} from './managers/index.js'

import { clipboard } from '../shared/index.js'

import type {
    projectOptions,
    SchemaItemNames,
    SequenceItemType,
    SequencePositionOptions
} from '../types/index.js'

export class KismetFile {
    public readonly id: ProcessId

    public mainSequence: Sequence
    /**
     * @deprecated
     */
    public classParser: CustomNodesManager
    public projectName: string
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
            project: this.id
        })

        this.classParser = new CustomNodesManager()
    }

    public static Items = {
        Actions,
        Conditions,
        Variables,
        Events,

        Comment,
        CommentFrame
    }

    public static listItems (
        input: Record<string, SequenceItemType[]>
    ): SequenceItemType[] {
        return Object.keys(input).flatMap(key => input[key])
    }

    public static async copy (item: SequenceItemType): Promise<void> {
        const input = item.toString()

        return await clipboard.write(input)
    }

    public async copyKismet (): Promise<void> {
        return await clipboard.write(this.toString())
    }

    public toString (): string {
        return this.mainSequence.toString()
    }
}

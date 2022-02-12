import clipboard from 'clipboardy'

import { 
    Comment,
    CommentFrame,
    Sequence 
} from "./Sequence/index.js"

import {
    Variables,
    Actions,
    Conditions,
    Events 
} from '../items/index.js'

import { 
    CustomNodesManager 
} from './managers/index.js'

import type { 
    projectOptions,
    SchemaItemNames,
    SequencePositionOptions
} from '../types/index.js'

export class KismetFile {
    public mainSequence: Sequence;
    public parser: CustomNodesManager;
    public projectName: string;
    public layout?: SequencePositionOptions<SchemaItemNames>

    constructor (options: projectOptions<SchemaItemNames>) {
        const { projectName, layout } = options

        this.projectName = projectName

        this.layout = layout

        this.mainSequence = new Sequence({ 
            name: 'Main_Sequence',  
            layout: this.layout,
            mainSequence: true
        })

        this.parser = new CustomNodesManager('./src/test/')
    }

    static Items = {
        Actions,
        Conditions,
        Variables,
        Events,

        Comment,
        CommentFrame
    }

    public async copyKismet (): Promise<void> {
        return await clipboard.write(this.toKismet())
    }

    public toKismet (): string {
        return this.mainSequence.toKismet()
    }
}
import clipboard from 'clipboardy'

import { 
    Comment,
    CommentFrame,
    Sequence 
} from "./Sequence/index.js";

import {
    Variables 
} from '../items/index.js'

import { CustomNodesManager } from './parser.js';

import type { 
    layoutOptions,
    projectOptions
} from '../types/index.js'

export class KismetFile {
    public mainSequence: Sequence;
    public parser: CustomNodesManager;
    public projectName: string;
    public layoutOptions: Required<layoutOptions>

    constructor (options: projectOptions) {
        const { projectName, layout } = options

        this.projectName = projectName

        this.layoutOptions = {
            startX: layout?.startX ?? 500,
            startY: layout?.startY ?? 500,
            spaceBetween: layout?.spaceBetween ?? 200
        }

        this.mainSequence = new Sequence({ 
            name: 'Main_Sequence',  
            layoutOptions: this.layoutOptions,
            mainSequence: true
        })

        this.parser = new CustomNodesManager('./node/test/')
    }

    static Items = {
        Action: null,
        Matinee: null,
        Condition: null,
        Variables,
        Event: null,

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
import clipboard from 'clipboardy'

import { 
    Comment,
    CommentFrame,
    Sequence 
} from "./Sequence/index.js";

import { CustomNodesManager } from './parser.js';

import type { 
    projectOptions
} from '../types/index.js'

export class KismetFile {
    public mainSequence: Sequence;
    public parser: CustomNodesManager;
    public projectName: string;
    public layoutOptions: { 
        startPosition: { x: number; y?: number; }; 
        space: number; 
    };

    constructor (options: projectOptions) {
        const { projectName } = options

        this.projectName = projectName

        this.layoutOptions = {
            startPosition: {
                x: options?.layout?.startX ?? 500,
                y: options?.layout?.startY ?? 500
            },
            space: options?.layout?.spaceBetween ?? 200
        }

        this.mainSequence = new Sequence('Main_Sequence')

        this.parser = new CustomNodesManager('./node/test/')
    }

    static Items = {
        Action: null,
        Matinee: null,
        Condition: null,
        Variable: null,
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
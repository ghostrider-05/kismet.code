import * as fs from 'fs'
import { resolve } from 'path'

import { Sequence } from "./Sequence/index.js";

import type { UDKoptions } from '../types/index.js'

const itemPath = resolve(import.meta.url, '../items/index.js')
const Items = fs.existsSync(itemPath) ? await import('file:///'+ itemPath) : null

if (!Items) throw new Error('No items are available for import')

export class UDK {
    public mainSequence: Sequence;
    public projectName: string;
    public layoutOptions: { 
        startPosition: { x: number; y?: number; }; 
        space: number; 
    };

    constructor (options: UDKoptions) {
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
    }

    static actions = Items.Actions
    static events = Items.Events
}
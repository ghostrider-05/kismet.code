import { KismetConnection } from './link.js';
import {
    KISMET_NODE_LINES,
    boolToKismet,
    filterEmptyLines,
    mapObjectKeys,
    parseVar
} from '../../../shared/index.js'

import type { KismetConnectionType } from '../../../types/index.js'

export interface KismetItemConfigOptions {
    ObjInstanceVersion: number
    ParentSequence: string
    ObjectArchetype: string
    inputs: {
        input?: string[],
        output?: string[],
        variable?: string[]
    }
    Draw: {
        width: number
        maxWidth?: number
        height?: number,
        inputOffset: number
    }
}

type KismetConnections = {
    input: KismetConnection[],
    output: KismetConnection[],
    variable: KismetConnection[]
}

export class BaseSequenceItem {
    public comment: string | null;
    public supressAutoComment: boolean | null;
    public outputCommentToScreen: boolean | null;
    public connections: KismetConnections;

    private kismet: { 
        x: number; 
        y: number; 
        class: string; 
        ObjectArchetype: string; 
        ParentSequence: string; 
        ObjInstanceVersion: number;
        Name: string;
        DrawConfig: {
            width: number
            maxWidth?: number | null
            height?: number | null
        }
    };

    constructor (options: KismetItemConfigOptions) {
        this.comment = null
        this.supressAutoComment = null
        this.outputCommentToScreen = null

        this.connections = ["input", "output", "variable"].map(key => {
            const { inputs } = options;

            return {
                key,
                connections: (inputs as Record<string, string[]>)[key]?.map(keys => {
                    return new KismetConnection(keys, key as KismetConnectionType)
                }) ?? []
            }
        }).reduce((x, y) => ({ ...x, [y.key]: y.connections }), {}) as KismetConnections

        this.kismet = {
            x: 0,
            y: 0,
            class: options.ObjectArchetype.split("'")[0],
            ObjectArchetype: options.ObjectArchetype,
            ParentSequence: options.ParentSequence,
            ObjInstanceVersion: options.ObjInstanceVersion,
            Name: `"${options.ObjectArchetype.split("'")[0].concat('_0')}"`,
            DrawConfig: {
                width: options.Draw.width,
                height: options.Draw.height ?? null,
                maxWidth: options.Draw.maxWidth ?? null
            }
        }

        // if (!this.kismet.DrawConfig.height && !this.kismet.DrawConfig.maxWidth) throw new Error()
    }

    private commentToKismet (): string {
        const kismet = [
            typeof this.comment === 'string' ? parseVar('ObjComment', `"${this.comment}"`) : '',
            this.supressAutoComment === false ? parseVar('bSuppressAutoComment', boolToKismet(this.supressAutoComment)) : '',
            this.outputCommentToScreen ? parseVar('bOutputObjCommentToScreen', boolToKismet(this.outputCommentToScreen)) : ''
        ]

        return filterEmptyLines(kismet)
    }

    public get linkId (): string {
        return `${this.kismet.class}'${this.kismet.Name}'`
    }

    public getConnection (type: KismetConnectionType, connectionName: string): KismetConnection | null {
        return this.connections[type]?.find(c => c.name === connectionName) ?? null
    }

    public setComment ({ comment, supressAutoComment, outputCommentToScreen }: {
        comment?: string,
        supressAutoComment?: boolean,
        outputCommentToScreen?: boolean
    }): this {
        this.comment = comment ?? null
        this.supressAutoComment = supressAutoComment ?? null
        this.outputCommentToScreen = outputCommentToScreen ?? null

        return this
    }  

    public setSequence (sequenceName: string): this {
        this.kismet.ParentSequence = `Sequence'${sequenceName}'`

        return this
    }

    public toKismet (): string {
        const { 
            class: Class,
            DrawConfig, 
            ObjectArchetype,
            ObjInstanceVersion, 
            ParentSequence, 
            Name 
        } = this.kismet

        const variables = [
            ['ObjInstanceVersion', ObjInstanceVersion],
            ['ParentSequence', ParentSequence],
            ['ObjPosX', '0'],
            ['ObjPosY', '0'],
            ['DrawWidth', DrawConfig.width],
            ['MaxWidth', DrawConfig.maxWidth],
            ['DrawHeight', DrawConfig.height],
            ['Name', Name],
            ['ObjectArchetype', ObjectArchetype]
        ].map(prop => parseVar(prop[0] as string, prop[1]))

        const properties = mapObjectKeys(this.connections, (c, i) => c.toKismet(i))
            .map(c => c.join('\n'))
            .concat(this.commentToKismet(), variables)

        const node = [
            KISMET_NODE_LINES.begin(Name, Class), 
            filterEmptyLines(properties), 
            KISMET_NODE_LINES.end
        ]

        return node.join('\n')
    }
}

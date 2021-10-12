import { SequenceVariable } from "./Variable";
import { KismetConnection } from './itemLink.js';

import type { KismetConnectionType } from '../../types/index.js'

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

export const KISMET_CONNECTION_SPACE = 21
export const KISMET_VARIABLE_OFFSET = 50
export const KISMET_OUTPUT_OFFSET = 5

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

    public get linkId (): string {
        return `${this.kismet.class}'${this.kismet.Name}'`
    }

    public getConnection (type: KismetConnectionType, connectionName: string): KismetConnection | null {
        return this.connections[type]?.find(c => c.name === connectionName) ?? null
    }

    public setComment ({ comment, supressAutoComment, outputCommentToScreen }: {
        comment: string,
        supressAutoComment: boolean,
        outputCommentToScreen: boolean
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
        return `
Begin Object Class=${this.kismet.class} Name=${this.kismet.Name}
   ${this.kismet.DrawConfig.maxWidth ? `MaxWidth=${this.kismet.DrawConfig.maxWidth}` : ''}
${this.connections.input.map((connection, i) => `   InputLinks(${i})=(${connection.toKismet()})`).join('\n')}
${this.connections.output.map((connection, i) => `   OutputLinks(${i})=(${connection.toKismet()})`).join('\n')}
${this.connections.variable.map((connection, i) => `   VariableLinks(${i})=(${connection.toKismet()})`).join('\n')}
   ObjInstanceVersion=${this.kismet.ObjInstanceVersion}
   ParentSequence=${this.kismet.ParentSequence}
   ObjPosX=0
   ObjPosY=0
   DrawWidth=${this.kismet.DrawConfig.width}
   ${this.kismet.DrawConfig.height ? `DrawHeight=${this.kismet.DrawConfig.height}` : ''}
   Name=${this.kismet.Name}
   ObjectArchetype=${this.kismet.ObjectArchetype}
End Object
        `.split('\n').filter(line => line.trim() !== '').join('\n')
    }
}

export class SequenceNode extends BaseSequenceItem {
    public hasBreakpoint: boolean;
    private variables: { name: string, value: string }[]

    constructor (options: KismetItemConfigOptions) {
        super(options)

        this.hasBreakpoint = false
        this.variables = []
    }

    public setBreakPoint (): this {
        this.hasBreakpoint = true

        return this
    }

    public removeBreakpoint (): this {
        this.hasBreakpoint = false

        return this
    }

    public setVariable (variableName: string, item: SequenceVariable | string): this {
        const connection = this.getConnection('variable', variableName)

        if (connection && typeof item !== 'string') {
            connection.addLink(item.linkId, this.connections.variable.indexOf(connection))
        } else {
            this.variables.push({
                name: variableName,
                value: String(item)
            })
        }

        return this
    }

    public override toKismet (): string {
        const kismet = super.toKismet()

        if (!this.hasBreakpoint) return kismet
        else return kismet.split('\n').flatMap((line, i) => i === 1 ? [
            line, 
            '   bIsBreakpointSet=True'
        ].concat(this.variables.map(v => `   ${v.name}=${v.value}`)) : line).join('\n')
    }
}
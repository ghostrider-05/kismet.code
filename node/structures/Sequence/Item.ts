import { SequenceVariable } from "./Variable";

export interface KismetItemConfigOptions {
    ObjInstanceVersion: number
    ParentSequence: string
    ObjectArchetype: string
    inputs: [number, number, number]
    Draw: {
        width: number
        maxWidth?: number
        height?: number,
        inputOffset: number
    }
}

export const KISMET_CONNECTION_SPACE = 21
export const KISMET_VARIABLE_OFFSET = 50
export const KISMET_OUTPUT_OFFSET = 5

export class BaseSequenceItem {
    public comment: string | null;
    public supressAutoComment: boolean | null;
    public outputCommentToScreen: boolean | null;

    private kismet: { 
        x: number; 
        y: number; 
        class: string; 
        ObjectArchetype: string; 
        ParentSequence: string; 
        ObjInstanceVersion: number;
        connections: number[][]
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

        this.kismet = {
            x: 0,
            y: 0,
            class: options.ObjectArchetype.split("'")[0],
            ObjectArchetype: options.ObjectArchetype,
            ParentSequence: options.ParentSequence,
            ObjInstanceVersion: options.ObjInstanceVersion,
            Name: `"${options.ObjectArchetype.split("'")[0].concat('_0')}"`,
            connections: options.inputs.map(number => [...Array(number).keys()]),
            DrawConfig: {
                width: options.Draw.width,
                height: options.Draw.height ?? null,
                maxWidth: options.Draw.maxWidth ?? null
            }
        }

        if (!this.kismet.DrawConfig.height && !this.kismet.DrawConfig.maxWidth) throw new Error()
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
${this.kismet.connections[0].map(index => `   InputLinks(${index})=(DrawY=0,OverrideDelta=10)`).join('\n')}
${this.kismet.connections[1].map(index => `   OutputLinks(${index})=(DrawY=0,OverrideDelta=10)`).join('\n')}
${this.kismet.connections[2].map(index => `   VariableLinks(${index})=(DrawX=0,OverrideDelta=10)`).join('\n')}
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

export class SequenceNode<V extends string = ''> extends BaseSequenceItem {
    public hasBreakpoint: boolean;
    public connectionNames: { in: string[]; out: string[]; variables: string[]; };
    public activedDelays: { name: string, duration: number }[];

    constructor (options: KismetItemConfigOptions) {
        super(options)

        this.hasBreakpoint = false
        this.activedDelays = []

        this.connectionNames = {
            in: ['in'],
            out: ['out'],
            variables: []
        }
    }

    public setActivatedDelay (name: V, delay?: number): this {
        const duration = delay ?? 1000

        if (this.connectionNames.out.includes(name)) {
            const activeDelay = this.activedDelays.find(x => x.name === name)

            if (!activeDelay) {
                this.activedDelays.push({ name, duration })
            } else {
                activeDelay.duration = duration
            }
        }

        return this
    }

    public setBreakPoint (): this {
        this.hasBreakpoint = true

        return this
    }

    public removeBreakpoint (): this {
        this.hasBreakpoint = false

        return this
    }

    public setVariable (item: SequenceVariable, variableName: keyof typeof this): this {
        if (this.connectionNames.variables.includes(variableName.toString()) && (variableName?.toString()?.length ?? 0) > 0) {
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            if (variableName.toString() in this) (this[variableName] as unknown as any) = item
        }

        return this
    }

    public override toKismet (): string {
        const kismet = super.toKismet()

        if (!this.hasBreakpoint) return kismet
        else return kismet.split('\n').flatMap((line, i) => i === 1 ? [line, '   bIsBreakpointSet=True'] : line).join('\n')
    }
}
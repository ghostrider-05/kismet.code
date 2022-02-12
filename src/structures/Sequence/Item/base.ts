import { Sequence } from '../base.js';
import { BaseKismetConnection, ItemConnection, VariableConnection } from './link.js';

import {
    ProcessId,
    ProcessManager
} from '../../managers/index.js'

import {
    Constants,
    filterEmptyLines,
    mapObjectKeys,
    parseVar,
    quote
} from '../../../shared/index.js'

import type { 
    BaseKismetItemOptions,
    KismetConnectionType,
    KismetConnection,
    KismetConnections,
    BaseKismetItemDrawOptions,
    SequenceItemType,
    SequenceItemTypeName,
    KismetVariablesType
} from '../../../types/index.js'

const { 
    KISMET_NODE_LINES,
    MAIN_SEQUENCE,
    ObjInstanceVersions
} = Constants

export class BaseSequenceItem {
    public comment: string | null;
    public supressAutoComment: boolean | null;
    public outputCommentToScreen: boolean | null;

    public connections: KismetConnections | null = null;
    public sequence: string | Sequence;

    public readonly type: SequenceItemTypeName | null
    public readonly id: ProcessId;

    private kismet: BaseKismetItemDrawOptions;

    constructor (options: BaseKismetItemOptions & { type?: SequenceItemTypeName }) {
        this.comment = null
        this.supressAutoComment = null
        this.outputCommentToScreen = null

        this.type = options.type ?? null

        try {
            this.connections = ["input", "output", "variable"].map(key => {
                const { inputs } = options;
                const links = (inputs as Record<string, string[]>)[key]

                if (links.length === 0 && ['input', 'output'].includes(key)) {
                    return {
                        key,
                        connections: this.type === 'events' && key === 'input' ? [] : [
                            new BaseKismetConnection({
                                input: key === 'input' ? 'In' : 'Out', 
                                type: key as KismetConnectionType,
                            })
                        ]
                    }
                } else return {
                    key,
                    connections: links.map(input => {
                        return BaseKismetConnection.convertLink(key as KismetConnectionType, input)
                    }).filter(n => n != undefined) as (ItemConnection | VariableConnection)[]
                }
            }).reduce((x, y) => ({ ...x, [y.key]: y.connections }), {}) as KismetConnections

        } catch (err) {
            console.log(err, this)
        }

        const [Class, defaultClass,] = options.ObjectArchetype.split("'")
        const [Package, ] = defaultClass.split('.')

        this.kismet = {
            x: 0,
            y: 0,
            class: Class,
            classType: `Class'${Package}.${Class}'`,
            ObjectArchetype: options.ObjectArchetype,
            ParentSequence: MAIN_SEQUENCE,
            ObjInstanceVersion: options.ObjInstanceVersion ?? 1,
            DrawConfig: {
                width: options.Draw?.width ?? 0,
                height: options.Draw?.height ?? null,
                maxWidth: options.Draw?.maxWidth ?? null
            }
        }

        this.id = ProcessManager.id(this.kismet.class)

        this.sequence = MAIN_SEQUENCE
    }

    private getKismetName (): string {
        const [, id] = this.id.resolveId().split('|')
        return this.kismet.ObjectArchetype.split("'")[0].concat(`_${id}`)
    }

    protected formatNode (properties: string[]): string {
        const item = [
            KISMET_NODE_LINES.begin(quote(this.getKismetName()), this.kismet.class), 
            filterEmptyLines(properties), 
            KISMET_NODE_LINES.end
        ]

        return item.join('\n')
    }

    protected setKismetSetting<T> (type: keyof BaseKismetItemDrawOptions, value: T): this {
        this.kismet[type] = value as T as never

        if (type === 'ObjectArchetype') {
            this.kismet.class = (value as unknown as string).split('\'')[0]
        }

        return this
    }

    public get linkId (): string {
        return `${this.kismet.class}'${this.getKismetName()}'`
    }

    public equals (item: SequenceItemType): boolean {
        return item.kismet?.ObjectArchetype === this.kismet.ObjectArchetype
    }

    public getConnection (type: KismetConnectionType, connectionName: string): (BaseKismetConnection | KismetConnection) | null {
        const connections = this.connections?.[type] as BaseKismetConnection[] | undefined

        return connections?.find(c => c.name === connectionName) ?? null
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

    public setSequence (sequence: string | Sequence): this {
        if (typeof sequence !== 'string') {
            this.sequence = sequence
            this.kismet.ParentSequence = sequence.linkId
        } else {
            this.kismet.ParentSequence = `Sequence'${sequence}'`
        }

        return this
    }

    public toJSON (): Record<string, KismetVariablesType> {
        const { 
            class: Class,
            DrawConfig, 
            ObjectArchetype,
            ObjInstanceVersion, 
            ParentSequence,
            x,
            y
        } = this.kismet

        const json: Record<string, KismetVariablesType> = {
            'ObjInstanceVersion': ObjInstanceVersions.get(Class) ?? ObjInstanceVersion,
            ParentSequence,
            'ObjPosX': x,
            'ObjPosY': y,
            'DrawWidth': DrawConfig.width,
            'MaxWidth': DrawConfig.maxWidth ?? null,
            'DrawHeight': DrawConfig.height ?? null,
            Name: quote(this.getKismetName()),
            ObjectArchetype
        }

        const connections = (this.connections as Record<string, BaseKismetConnection[]>) ?? {}
        const connectionValues = mapObjectKeys(connections, (c, i) => [c.prefix(i), c.value] as [string, string])

        connectionValues.forEach(type => {
            if (type.length > 0) {
                type.forEach(link => json[link[0]] = link[1])
            }
        })

        if (typeof this.comment === 'string') json['ObjComment'] = quote(this.comment)
        if (this.supressAutoComment === false) json['bSuppressAutoComment'] = this.supressAutoComment
        if (this.outputCommentToScreen) json['bOutputObjCommentToScreen'] = this.outputCommentToScreen

        return json
    }

    public toString (): string {
        const json = this.toJSON()

        const variables = Object.keys(json).map(n => parseVar(n, json[n]))

        return this.formatNode(variables)
    }

    public toKismet (): string {
        return this.toString()
    }
}

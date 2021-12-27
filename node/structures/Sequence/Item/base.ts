import { Sequence } from '../base.js';
import { BaseKismetConnection, KismetConnection } from './link.js';

import {
    ProcessId,
    ProcessManager
} from '../../../managers/index.js'

import {
    Constants,
    boolToKismet,
    filterEmptyLines,
    mapObjectKeys,
    parseVar,
    quote,
    propertyFromText
} from '../../../shared/index.js'

import type { 
    BaseKismetItemOptions,
    KismetConnectionType,
    KismetConnections,
    BaseKismetItemDrawOptions,
    SequenceItemType,
    SequenceItemTypeName
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

                if (!links) return {
                    key,
                    connections: []
                }

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
                    connections: links.map(keys => {
                        return new KismetConnection(keys, key as KismetConnectionType)
                    }) 
                }
            }).reduce((x, y) => ({ ...x, [y.key]: y.connections }), {}) as KismetConnections

        } catch (err) {
            console.log(err, this)
        }

        const { position, sequence, overwriteNumber } = options.textOptions || {}

        this.kismet = {
            x: position?.x ?? 0,
            y: position?.y ?? 0,
            class: options.ObjectArchetype.split("'")[0],
            ObjectArchetype: options.ObjectArchetype,
            ParentSequence: `Sequence'${sequence}'` ?? MAIN_SEQUENCE,
            ObjInstanceVersion: options.ObjInstanceVersion ?? 1,
            DrawConfig: {
                width: options.Draw?.width ?? 0,
                height: options.Draw?.height ?? null,
                maxWidth: options.Draw?.maxWidth ?? null
            }
        }

        this.id = ProcessManager.id(this.kismet.class, overwriteNumber)

        this.sequence = MAIN_SEQUENCE
    }

    private commentToKismet (): string {
        const kismet = [
            typeof this.comment === 'string' ? parseVar('ObjComment', quote(this.comment)) : '',
            this.supressAutoComment === false ? parseVar('bSuppressAutoComment', boolToKismet(this.supressAutoComment)) : '',
            this.outputCommentToScreen ? parseVar('bOutputObjCommentToScreen', boolToKismet(this.outputCommentToScreen)) : ''
        ]

        return filterEmptyLines(kismet)
    }

    private getKismetName (): string {
        const [, id] = this.id.resolveId().split('|')
        return this.kismet.ObjectArchetype.split("'")[0].concat(`_${id}`)
    }

    protected setKismetSetting<T> (type: keyof BaseKismetItemDrawOptions, value: T): this {
        this.kismet[type] = value as T as never

        if (type === 'ObjectArchetype') {
            this.kismet.class = (value as unknown as string).split('\'')[0]
        }

        return this
    }

    private static linksFromText (lines: [string, string][]): Record<KismetConnectionType, string[]> {
        const linkLines = lines.map(n => {
            if (n[0].match(/\w*(InputLinks|OutputLinks|VariableLinks)\w*/g)) {
                return {
                    type: n[0].slice(0, n.indexOf('(')).toLowerCase().slice(0, n[0].indexOf('Links')),
                    value: n
                }
            } else return undefined
        }).filter(n => n != undefined)
        
        return linkLines.reduce((prev, curr) => {
            const type = curr?.type as string
            const value = curr?.value[1] as string

            if (!prev[type]) prev[type] = []
            prev[type].push(value)

            return prev
        }, {} as Record<string, string[]>)
    }

    public static fromText (input: string): { item: BaseSequenceItem, properties: [string, string][] } {
        const map = new Map<string, string>()

        const lines = input.split('\n')
        const ClassInfo = (info: RegExp) => lines[0].match(info)?.[0].split('=')[1]

        const Class = ClassInfo(/\w*Class=\w*/g), 
            name = ClassInfo(/\w*Name=\w*/)

        if (Class === 'Sequence') throw new Error('Missing sequence items')

        const nameId = name?.slice(name.lastIndexOf('_') + 1)

        const properties = lines
            .filter((_, i) => i > 0 && (i + 1) < lines.length)
            .map(propertyFromText)

        properties.forEach(property => {
                const [rawName, value] = property
                map.set(rawName, value)
        })

        const item = new BaseSequenceItem({
            inputs: BaseSequenceItem.linksFromText(properties),
            ObjectArchetype: map.get('ObjectArchetype') as string,
            ObjInstanceVersion: Number(map.get('ObjInstanceVersion') ?? 1),
            textOptions: {
                overwriteNumber: nameId ? Number(nameId) : undefined,
                sequence: map.get('ParentSequence'),
                position: {
                    x: Number(map.get('ObjPosX')),
                    y: Number(map.get('ObjPostY'))
                }
            }
        })

        return {
            item,
            properties
        }
    }

    public get linkId (): string {
        return `${this.kismet.class}'${this.getKismetName()}'`
    }

    public equals (item: SequenceItemType): boolean {
        return item.kismet?.ObjectArchetype === this.kismet.ObjectArchetype
    }

    public getConnection (type: KismetConnectionType, connectionName: string): (BaseKismetConnection | KismetConnection) | null {
        return this.connections?.[type]?.find(c => c.name === connectionName) ?? null
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

    public toKismet (): string {
        const { 
            class: Class,
            DrawConfig, 
            ObjectArchetype,
            ObjInstanceVersion, 
            ParentSequence,
            x,
            y
        } = this.kismet

        const Name = `"${this.getKismetName()}"`

        const variables = [
            ['ObjInstanceVersion', ObjInstanceVersions.get(Class) ?? ObjInstanceVersion],
            ['ParentSequence', ParentSequence],
            ['ObjPosX', x],
            ['ObjPosY', y],
            ['DrawWidth', DrawConfig.width],
            ['MaxWidth', DrawConfig.maxWidth],
            ['DrawHeight', DrawConfig.height],
            ['Name', Name],
            ['ObjectArchetype', ObjectArchetype]
        ].map(prop => parseVar(prop[0] as string, prop[1]))

        const properties = mapObjectKeys(this.connections ?? {}, (c, i) => c.toKismet(i))
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

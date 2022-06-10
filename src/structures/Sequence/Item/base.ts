import { BaseItem } from './_base.js'
import { Sequence } from '../base.js'
import {
    BaseKismetConnection,
    ItemConnection,
    VariableConnection,
} from './link.js'

import { ProcessId, ProcessManager } from '../../managers/index.js'

import {
    Constants,
    filterEmptyLines,
    mapObjectKeys,
    parseVar,
    quote,
    readArchetype,
} from '../../../shared/index.js'

import type {
    BaseKismetItemOptions,
    KismetConnectionType,
    KismetConnection,
    KismetConnections,
    BaseKismetItemDrawOptions,
    SequenceItemType,
    SequenceItemTypeName,
    KismetVariablesType,
    KismetPosition,
} from '../../../types/index.js'

const { KISMET_NODE_LINES, MAIN_SEQUENCE, ObjInstanceVersions } = Constants

export class BaseSequenceItem extends BaseItem {
    /** @deprecated */
    public comment: string | null
    /** @deprecated */
    public supressAutoComment: boolean | null
    /** @deprecated */
    public outputCommentToScreen: boolean | null

    public commentOptions: {
        comment?: string
        supressAutoComment?: boolean
        outputCommentToScreen?: boolean
    } = {}

    public connections: KismetConnections = {
        input: [],
        output: [],
        variable: [],
    }
    public sequence: string

    public readonly id: ProcessId

    private kismet: BaseKismetItemDrawOptions

    constructor (
        options: BaseKismetItemOptions & { type?: SequenceItemTypeName }
    ) {
        super(options.type)

        this.comment = null
        this.supressAutoComment = null
        this.outputCommentToScreen = null
        this.sequence = MAIN_SEQUENCE

        this._setConnections(options.inputs)
        const { Class, Package } = readArchetype(options.ObjectArchetype)

        this.kismet = {
            x: options.position?.x ?? 0,
            y: options.position?.y ?? 0,
            class: Class,
            classType: `Class'${Package}.${Class}'`,
            ObjectArchetype: options.ObjectArchetype,
            ParentSequence: options.sequence
                ? `Sequence'${options.sequence}'`
                : MAIN_SEQUENCE,
            ObjInstanceVersion: options.ObjInstanceVersion ?? 1,
            DrawConfig: {
                width: options.Draw?.width ?? 0,
                height: options.Draw?.height ?? null,
                maxWidth: options.Draw?.maxWidth ?? null,
            },
        }

        this.id = ProcessManager.id(this.kismet.class, {
            index: options.index,
        })
    }

    private _setConnections (inputs: BaseKismetItemOptions['inputs']): void {
        try {
            this.connections = ['input', 'output', 'variable']
                .map(key => {
                    const links = inputs[key as keyof typeof inputs]

                    return this._groupConnections(links, key)
                })
                .reduce(
                    (x, y) => ({ ...x, [y.key]: y.connections }),
                    {}
                ) as KismetConnections
        } catch (err) {
            console.log(err, this)
        }
    }

    private _groupConnections (links: string[] | undefined, key: string) {
        if (!links)
            return {
                key,
                connections: [],
            }

        if (links.length === 0 && ['input', 'output'].includes(key)) {
            return {
                key,
                connections:
                    this.type === 'events' && key === 'input'
                        ? []
                        : [
                              new BaseKismetConnection({
                                  input: key === 'input' ? 'In' : 'Out',
                                  type: key as KismetConnectionType,
                              }),
                          ],
            }
        } else
            return {
                key,
                connections: links
                    .map(input => {
                        return BaseKismetConnection.convertLink(
                            key as KismetConnectionType,
                            input
                        )
                    })
                    .filter(n => n != undefined) as (
                    | ItemConnection
                    | VariableConnection
                )[],
            }
    }

    private _BasetoJSON () {
        const {
            class: Class,
            DrawConfig,
            ObjectArchetype,
            ObjInstanceVersion,
            ParentSequence,
            x,
            y,
        } = this.kismet

        const json: Record<string, KismetVariablesType> = {
            ObjInstanceVersion:
                ObjInstanceVersions.get(Class) ?? ObjInstanceVersion,
            ParentSequence,
            ObjPosX: x,
            ObjPosY: y,
            DrawWidth: DrawConfig.width,
            MaxWidth: DrawConfig.maxWidth ?? null,
            DrawHeight: DrawConfig.height ?? null,
            Name: quote(this.getKismetName()),
            ObjectArchetype,
        }

        return json
    }

    private getKismetName (): string {
        const [, id] = this.id.resolveId().split('|')
        return this.kismet.ObjectArchetype.split("'")[0].concat(`_${id}`)
    }

    protected formatNode (properties: string[]): string {
        const item = [
            KISMET_NODE_LINES.begin(
                quote(this.getKismetName()),
                this.kismet.class
            ),
            filterEmptyLines(properties),
            KISMET_NODE_LINES.end,
        ]

        return item.join('\n')
    }

    protected setKismetSetting<T> (
        type: keyof BaseKismetItemDrawOptions,
        value: T
    ): this {
        this.kismet[type] = value as T as never

        if (type === 'ObjectArchetype') {
            this.kismet.class = (value as unknown as string).split("'")[0]
        }

        return this
    }

    public get linkId (): string {
        return `${this.kismet.class}'${this.getKismetName()}'`
    }

    public equals (item: SequenceItemType): boolean {
        return item.kismet.ObjectArchetype === this.kismet.ObjectArchetype
    }

    public getConnection (
        type: KismetConnectionType,
        connectionName?: string
    ): (BaseKismetConnection | KismetConnection) | null {
        const connections = this.connections?.[type] as
            | BaseKismetConnection[]
            | undefined

        if (!connectionName) return null
        return connections?.find(c => c.name === connectionName) ?? null
    }

    public setComment ({
        comment,
        supressAutoComment,
        outputCommentToScreen,
    }: {
        comment?: string
        supressAutoComment?: boolean
        outputCommentToScreen?: boolean
    }): this {
        this.commentOptions.comment = comment
        this.commentOptions.supressAutoComment = supressAutoComment
        this.commentOptions.outputCommentToScreen = outputCommentToScreen

        return this
    }

    public setPosition (position: KismetPosition, offset?: boolean): this {
        const { x, y } = position

        this.kismet.x = x + (offset ? this.kismet.x : 0)
        this.kismet.y = y + (offset ? this.kismet.y : 0)

        return this
    }

    public setSequence (
        sequence: string | Sequence,
        addToSequence?: boolean
    ): this {
        if (typeof sequence !== 'string') {
            this.kismet.ParentSequence = sequence.linkId

            if (addToSequence ?? true) sequence.addItem(this, false)
            this.sequence = sequence.linkId
        } else if (typeof this.sequence === 'string') {
            this.kismet.ParentSequence = `Sequence'${sequence}'`
            this.sequence = `Sequence'${sequence}'`
        }

        return this
    }

    public toJSON (): Record<string, KismetVariablesType> {
        const json = this._BasetoJSON()

        const connections =
            (this.connections as Record<string, BaseKismetConnection[]>) ?? {}
        mapObjectKeys(
            connections,
            (c, i) => [c.prefix(i), c.value] as [string, string]
        ).forEach(type => {
            if (type.length > 0) type.forEach(link => (json[link[0]] = link[1]))
        })

        const { comment, outputCommentToScreen, supressAutoComment } =
            this.commentOptions

        if (typeof comment === 'string') json['ObjComment'] = quote(comment)
        if (supressAutoComment === false)
            json['bSuppressAutoComment'] = supressAutoComment
        if (outputCommentToScreen)
            json['bOutputObjCommentToScreen'] = outputCommentToScreen

        return json
    }

    public toString (): string {
        const json = this.toJSON()

        const variables = Object.keys(json).map(n => parseVar(n, json[n]))

        return this.formatNode(variables)
    }

    /**
     * @deprecated
     */
    public toKismet (): string {
        return this.toString()
    }
}

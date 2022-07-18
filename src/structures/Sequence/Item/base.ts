import { BaseItem } from './_base.js'
import { Sequence } from '../base.js'
import { BaseKismetConnection } from './link.js'
import { ItemConnectionManager } from './connection.js'

import { KismetBoolean } from '../misc/Boolean.js'

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
    KismetPosition,
    KismetVariableValue,
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

    public connections: KismetConnections
    public sequence: string

    public readonly id: ProcessId
    public name: string

    public raw: [string, KismetVariableValue][] = []
    private kismet: BaseKismetItemDrawOptions

    constructor (
        options: BaseKismetItemOptions & { type?: SequenceItemTypeName }
    ) {
        super(options.type)

        this.comment = null
        this.supressAutoComment = null
        this.outputCommentToScreen = null
        const sequence = options.sequence
            ? `Sequence'${options.sequence}'`
            : MAIN_SEQUENCE
        this.sequence = sequence

        this.connections = ItemConnectionManager.createConnections(
            options.inputs,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            options.type!
        )
        const { Class, Package } = readArchetype(options.ObjectArchetype)

        this.name = options.name ?? Class

        this.kismet = {
            x: options.position?.x ?? 0,
            y: options.position?.y ?? 0,
            class: Class,
            classType: `Class'${Package}.${Class}'`,
            ObjectArchetype: options.ObjectArchetype,
            ParentSequence: sequence,
            ObjInstanceVersion:
                options.ObjInstanceVersion ??
                ObjInstanceVersions.get(Class) ??
                1,
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

    private _BasetoJSON () {
        const {
            DrawConfig,
            ObjectArchetype,
            ObjInstanceVersion,
            ParentSequence,
            x,
            y,
        } = this.kismet

        const json: Record<string, KismetVariableValue> = {
            ...(this.raw.reduce(
                (prev, curr) => ({ ...prev, [curr[0]]: curr[1] }),
                {}
            ) ?? {}),
            ObjInstanceVersion,
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

    public toJSON (): Record<string, KismetVariableValue> {
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

    public static fromJSON (input: Record<string, KismetVariableValue>) {
        const keys = [
            'ObjectArchetype',
            'ObjComment',
            'bSuppressAutoComment',
            'bIsBreakpointSet',
            'bOutputObjCommentToScreen',
        ] as const
        type Writeable<T> = { -readonly [P in keyof T]: T[P] }
        type RawJSON = Record<Writeable<typeof keys>[number], string>

        const keyValues = keys.reduce(
            (_, key) => ({ ..._, [key]: input[key] }),
            {} as RawJSON
        )

        const comment = {
            ...keyValues,
            supressAutoComment: KismetBoolean.toCode(
                keyValues.bSuppressAutoComment,
                true
            ),
            outputCommentToScreen: KismetBoolean.toCode(
                keyValues.bSuppressAutoComment,
                true
            ),
        }

        return new BaseSequenceItem({
            ...keyValues,
            inputs: ItemConnectionManager.fromText(input),
            sequence: <string>input['ParentSequence'],
            position: {
                x: Number(input['ObjPosX']),
                y: Number(input['ObjPosY']),
            },
        }).setComment(comment)
    }
}

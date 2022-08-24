import {
    convertVariablesRecordToArray,
    Constants,
    mapObjectKeys,
    KismetItemFormatter,
    quote,
    readArchetype,
} from '@kismet.ts/shared'

import { BaseItem } from './_base.js'
import { BaseKismetConnection } from './link.js'
import { ItemConnectionManager } from './connection.js'

import { KismetBoolean } from '../util/index.js'
import { ProcessId, ProcessManager } from '../managers/index.js'

import type {
    KismetConnectionType,
    KismetConnection,
    KismetConnections,
} from './link.js'

import type {
    BaseKismetItemOptions,
} from './options.js'

import type { 
    Sequence, 
    KismetPosition, 
    KismetVariableValue, 
    SequenceItemType, 
    SequenceItemTypeName 
} from '../structures/index.js'

const { DefaultMainSequenceName, ObjInstanceVersions } = Constants

export interface BaseKismetItemRawData {
    ObjPosX: number
    ObjPosY: number
    ObjectArchetype: string
    ObjInstanceVersion: number
}

export class BaseSequenceItem extends BaseItem {
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
    public rawData: BaseKismetItemRawData;

    constructor (
        options: BaseKismetItemOptions & { type?: SequenceItemTypeName }
    ) {
        super(options.type)

        this.sequence = `Sequence'${options.sequence ?? DefaultMainSequenceName}'`

        this.connections = ItemConnectionManager.createConnections(
            options.inputs,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            options.type!
        )
        const { Class } = readArchetype(options.ObjectArchetype)

        this.name = options.name ?? Class

        this.rawData = {
            ObjectArchetype: options.ObjectArchetype,
            ObjInstanceVersion:
                ObjInstanceVersions.get(Class) ??
                (this.type === Constants.NodeType.EVENTS
                    ? undefined
                    : options.ObjInstanceVersion) ??
                1,
            ObjPosX: options.position?.x ?? 0,
            ObjPosY: options.position?.y ?? 0
        }

        this.id = ProcessManager.id(this.ClassData.Class, {
            index: options.index,
        })
    }

    private get baseJSON (): Record<string, KismetVariableValue> {
        return {
            ...(this.raw.reduce(
                (prev, curr) => ({ ...prev, [curr[0]]: curr[1] }),
                {}
            ) ?? {}),
            ...this.rawData,
            ParentSequence: this.sequence,
            Name: quote(this.rawName),
            DrawWidth: 0,
            MaxWidth: null,
            DrawHeight: null,
        }
    }

    public get rawName (): string {
        const [, id] = this.id.resolveId().split('|')
        return this.rawData.ObjectArchetype.split("'")[0].concat(`_${id}`)
    }

    public get ClassData () {
        return readArchetype(this.rawData.ObjectArchetype)
    }

    public get linkId (): string {
        return `${this.ClassData.Class}'${this.rawName}'`
    }

    public get position (): KismetPosition {
        return {
            x: this.rawData.ObjPosX,
            y: this.rawData.ObjPosY
        }
    }

    public equals (item: SequenceItemType): boolean {
        return item.rawData.ObjectArchetype === this.rawData.ObjectArchetype
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

        this.rawData.ObjPosX = x + (offset ? this.rawData.ObjPosX : 0)
        this.rawData.ObjPosY = y + (offset ? this.rawData.ObjPosY : 0)

        return this
    }

    public setProperty (...properties: { name: string, value: KismetVariableValue }[]): this {
        for (const property of properties.filter(p => p.value != undefined)) {
            const { name, value } = property

            this.raw.push([name, value])
        }

        return this
    }

    public setSequence (
        sequence: string | Sequence,
        addToSequence?: boolean
    ): this {
        if (typeof sequence !== 'string') {
            if (addToSequence ?? true) sequence.addItem(this, false)
            this.sequence = sequence.linkId
        } else if (typeof this.sequence === 'string') {
            this.sequence = `Sequence'${sequence}'`
        }

        return this
    }

    public toJSON (): Record<string, KismetVariableValue> {
        const json = this.baseJSON

        const connections =
            (this.connections) ?? {}
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
        const variables = convertVariablesRecordToArray(this.toJSON())

        return KismetItemFormatter.format(this.rawName, this.ClassData.Class, variables)
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
        }).setComment(comment).linkId
    }
}

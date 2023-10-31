import {
    convertVariablesRecordToArray,
    Constants,
    KismetItemFormatter,
    quote,
    readArchetype,
    KismetError,
    getNodeType,
    typeguards,
} from '@kismet.ts/shared'

import { BaseItem } from './_base.js'
import { BaseKismetConnection } from './link.js'
import { ItemConnectionManager } from './connection.js'

import { KismetBoolean } from '../util/index.js'
import { ProcessId, ProcessManager } from '../managers/index.js'

import type {
    KismetConnectionType,
    KismetConnection,
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

export interface KismetComment {
    comment?: string
    supressAutoComment?: boolean
    outputCommentToScreen?: boolean
}

export class BaseSequenceItem extends BaseItem {
    public commentOptions: KismetComment = {}

    public connections: ItemConnectionManager
    public sequence: string

    public readonly id: ProcessId
    public name: string

    public raw: [string, KismetVariableValue][] = []
    public rawData: BaseKismetItemRawData;

    private _category: string | undefined = undefined

    constructor (
        options: BaseKismetItemOptions & { type?: SequenceItemTypeName }
    ) {
        BaseSequenceItem.validateOptions(options)

        const { Class } = readArchetype(options.ObjectArchetype)
        const type = options.type ?? getNodeType(Class)
        super(type)

        this.sequence = `Sequence'${options.sequence ?? DefaultMainSequenceName}'`

        this._category = options.category

        this.connections = new ItemConnectionManager(
            options.inputs,
            type
        )

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

    protected static validateOptions (options: BaseKismetItemOptions): void {
        const { ObjectArchetype } = options
    
        if (!ObjectArchetype) new KismetError('INVALID_TYPE', [
            ObjectArchetype, 'string'
        ], { data: { 'item': 'BaseSequenceItem' }})
    }

    private get commentJSON () {
        type RawCommentKey = 
            | 'ObjComment' 
            | 'bSuppressAutoComment'
            | 'bOutputObjCommentToScreen'

        const json: Partial<Record<RawCommentKey, string | boolean>> = {};
        const { comment, outputCommentToScreen, supressAutoComment } = this.commentOptions

        if (typeof comment === 'string') {
            json['ObjComment'] = quote(comment)
        }
        if (supressAutoComment === false) {
            json['bSuppressAutoComment'] = supressAutoComment
        }
        if (outputCommentToScreen) {
            json['bOutputObjCommentToScreen'] = outputCommentToScreen
        }

        return json
    }

    public get rawName (): string {
        const [, id] = this.id.resolveId().split('|')
        return this.rawData.ObjectArchetype.split("'")[0].concat(`_${id}`)
    }

    public get category (): string | undefined {
        return this._category ?? this.raw.find(r => r[0] === 'ObjCategory')?.toString()
    }

    public get ClassData () {
        return readArchetype(this.rawData.ObjectArchetype)
    }

    public get linkId (): string {
        return `${this.ClassData.Class}'${this.rawName}'`
    }

    public get position (): Readonly<KismetPosition> {
        return {
            x: this.rawData.ObjPosX,
            y: this.rawData.ObjPosY
        }
    }

    /**
     * Break all object links to other items.
     * 
     * Same as the editor right click > Break all links to Object(s)
     * @deprecated
     */
    public breakAllLinks (): void {
        this.connections.breakAllLinks()
    }

    /**
     * Hide all connection sockets that have no connections currently.
     * 
     * Same as the editor right click > Hide unused connectors
     * @deprecated
     */
    public hideUnusedConnections (): void {
        this.connections.hideUnused()
    }

    /**
     * Show all connection sockets.
     * 
     * Same as the editor right click > Show all connectors
     * @deprecated
     */
    public showAllConnections (): void {
        this.connections.showAll()
    }

    /**
     * Check whether another item is of the same type as this item
     * @param item 
     */
    public equals (item: SequenceItemType): boolean {
        return item.rawData.ObjectArchetype === this.rawData.ObjectArchetype
    }

    public strictEquals (item: SequenceItemType): boolean {
        return this.equals(item) && item.rawName === this.rawName;
    }

    /** @deprecated */
    public getConnection (
        type: KismetConnectionType,
        connectionName?: string
    ): (BaseKismetConnection | KismetConnection) | null {
        if (!connectionName) return null
        else return this.connections.get(type, connectionName) ?? null
    }

    /**
     * Set a comment on this item. This comment will be visible in the editor
     * @param comment The text of the comment or the text in combination with comment options 
     */
    public setComment (comment: string | {
        comment?: string
        supressAutoComment?: boolean
        outputCommentToScreen?: boolean
    }): this {
        const { isBoolean, isString } = typeguards

        if (isString(comment)) {
            this.commentOptions.comment = comment
        } else {
            const { comment: c, outputCommentToScreen, supressAutoComment } = comment

            if (isString(c))
                this.commentOptions.comment = c
            if (isBoolean(supressAutoComment)) 
                this.commentOptions.supressAutoComment = supressAutoComment
            if (isBoolean(outputCommentToScreen))
                this.commentOptions.outputCommentToScreen = outputCommentToScreen
        }

        return this
    }

    /**
     * Set a new position for this item
     * @param position The new position coordinates
     * @param offset Whether to use the new position as an offset to the current position (default: false)
     */
    public setPosition (position: KismetPosition, offset?: boolean): this {
        const { x, y } = position

        this.rawData.ObjPosX = x + (offset ? this.rawData.ObjPosX : 0)
        this.rawData.ObjPosY = y + (offset ? this.rawData.ObjPosY : 0)

        return this
    }

    /**
     * Set a variable if the variable has no variable connection. 
     * Used for properties you can set in the properties screen in the editor.
     * @param properties The properties to set. Will not overwrite currently set properties
     */
    public setProperty (...properties: { name: string, value: KismetVariableValue }[]): this {
        for (const property of properties.filter(p => p.value != undefined)) {
            const { name, value } = property

            this.raw.push([name, value])
        }

        return this
    }

    /**
     * Change the sequence of this item
     * @param sequence The new sequence of this item: the linkId or the sequence itself
     * @param addToSequence If 'sequence' is the new sequence, whether to add the item to the sequence
     */
    public setSequence (
        sequence: string | Sequence,
        addToSequence?: boolean
    ): this {
        if (typeof sequence !== 'string') {
            if (addToSequence ?? true) sequence.addItem(this, false)
            this.sequence = sequence.linkId
        } else if (typeof this.sequence === 'string') {
            // TODO: replace with regex match?
            this.sequence = sequence.startsWith('Sequence') ? sequence : `Sequence'${sequence}'`
        }

        return this
    }

    public toJSON (): Record<string, KismetVariableValue> {
        return {
            ...(this.raw.reduce(
                (prev, curr) => ({ ...prev, [(prev[curr[0]] ? curr[0] + ' ' : curr[0])]: curr[1] }),
                {} as Record<string, KismetVariableValue>
            ) ?? {}),
            ...this.rawData,
            ObjInstanceVersion: this.rawData.ObjInstanceVersion < 0 
                ? undefined 
                : this.rawData.ObjInstanceVersion,
            ParentSequence: this.sequence,
            Name: quote(this.rawName),
            DrawWidth: 0,
            MaxWidth: null,
            DrawHeight: null,
            ...this.connections.toJSON(),
            ...this.commentJSON,
        }
    }

    public toString (): string {
        const variables = convertVariablesRecordToArray(this.toJSON())

        return KismetItemFormatter.format(this.rawName, this.ClassData.Class, variables)
    }

    /**
     * Converts a two dimensional array of properties to an object.
     * Then calls {@link BaseSequenceItem.fromJSON} with the object
     * @param input 
     */
    public static fromRaw (input: [string, KismetVariableValue][]) {
        const record = input.reduce((previous, currentValue) => {
            const [name, value] = currentValue

            return {
                ...previous,
                [name]: value
            }
        }, {} as Record<string, KismetVariableValue>)

        return BaseSequenceItem.fromJSON(record)
    }

    /**
     * Converts an object to an item ands sets all other variables on the item.
     * Special object keys:
     * 
     * @param input 
     * @returns 
     */
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

        const parentSequence = <string | undefined>input['ParentSequence']
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
            index: <number>input['KismetItemIdx'],
            inputs: ItemConnectionManager.fromText(input),
            sequence: parentSequence?.match(/(?<=Sequence').+(?=')/)?.[0] ?? parentSequence,
            position: {
                x: Number(input['ObjPosX'] ?? 0),
                y: Number(input['ObjPosY'] ?? 0),
            },
        }).setComment(comment)
    }
}

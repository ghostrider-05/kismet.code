import { BaseItem } from './Item/_base.js'
import { SequenceUtil } from './baseUtil.js'

import {
    ProcessManager,
    ProcessId,
    SequencePositionManager,
} from '../managers/index.js'

import {
    Constants,
    filterEmptyLines,
    parseVar,
} from '../../shared/index.js'

import type {
    SequenceItemType,
    SequenceViewOptions,
    SequenceOptions,
    SequenceBaseConstructorOptions,
    SchemaItemNames,
    KismetVariableValue,
} from '../../types/index.js'


const { DefaultLayoutOptions, KISMET_NODE_LINES, MAIN_SEQUENCE, NodeType } =
    Constants

export type SequenceItemResolvable = string | ProcessId | SequenceItemType
export type SequenceResolvable = Sequence | SequenceItemResolvable

/**
 * Class for a kismet sequence
 */
export class Sequence extends BaseItem {
    public name: string

    /**
     * The location of focus when opening the sequence
     */
    public defaultView: Required<SequenceViewOptions>

    public readonly id: ProcessId

    /**
     * The id of the attached project to this sequence
     */
    public readonly project?: ProcessId

    /**
     * Whether this sequence can be edited
     */
    public enabled = true

    /**
     * The parent sequence of this sequence.  
     */
    public parentSequence: string = MAIN_SEQUENCE

    /**
     * The items that are added to this sequence
     */
    public items: (SequenceItemType | Sequence)[] = []

    /**
     * The subsequences that are added in this sequence
     */
    public get subSequences (): Sequence[] {
        return this.items.filter(item => {
            return item.isSequence()
        }) as Sequence[]
    }

    private kismet: { x: number; y: number }
    private positionManager: SequencePositionManager
    private readonly mainSequence: boolean

    constructor (options?: SequenceBaseConstructorOptions<SchemaItemNames>) {
        super(NodeType.SEQUENCES)

        const { name, mainSequence, defaultView, layout, project } =
            options ?? {}

        this.name = name ?? 'Sub_Sequence'
        this.id = ProcessManager.id('Sequence', { id: project })

        this.parentSequence = MAIN_SEQUENCE

        this.mainSequence = mainSequence ?? false

        this.kismet = {
            x: 0,
            y: 0,
        }

        this.defaultView = {
            x: defaultView?.x ?? 0,
            y: defaultView?.y ?? 0,
            zoom: defaultView?.zoom ?? 1,
        }

        this.positionManager = new SequencePositionManager({
            layoutOptions: layout?.position ?? DefaultLayoutOptions,
            style: layout?.style,
            schema: layout?.schema,
            projectId: project,
        })
    }

    private get properties () {
        const archetype = `Sequence'Engine.Default__Sequence'`
        const ObjInstanceVersion = 1
        const DrawHeight = 0
        const DrawWidth = 0

        return {
            archetype,
            ObjInstanceVersion,
            DrawHeight,
            DrawWidth,
            ...this.kismet,
        }
    }

    public get util (): SequenceUtil {
        return new SequenceUtil(this)
    }

    public get linkId (): string {
        return `Sequence'${this.name}'`
    }

    public addItem (item: SequenceItemType, overwriteSequence?: boolean): this {
        if (overwriteSequence ?? true) item.setSequence(this, false)

        this.items.push(item)

        return this
    }

    public addItems (items: SequenceItemType[]): this {
        items.forEach(item => this.addItem(item))

        return this
    }

    public addSubSequence ({
        name,
        objects,
        layout,
        defaultView,
    }: SequenceOptions<SequenceItemType, SchemaItemNames>): {
        subSequence: Sequence
        sequence: Sequence
    } {
        const subSequence = new Sequence({
            layout: {
                position: layout?.position ?? this.positionManager.options,
                schema: layout?.schema,
                style: layout?.style,
            },
            name,
            defaultView,
            project: this.project,
        }).addItems(objects?.map(x => x.setSequence(name)) ?? [])

        subSequence.parentSequence = this.linkId

        this.items.push(subSequence)

        return {
            subSequence,
            sequence: this,
        }
    }

    /**
     * Clear all breakpoints on items in this sequence
     * @param includeSubsequences Whether to clear breakpoints in subsequences (default false)
     */
    public clearAllBreakpoints (includeSubsequences?: boolean): this {
        this.items.forEach(item => {
            if (item.isSequenceNode()) {
                this.updateItem(item, item.setBreakpoint(false))
            } else if (includeSubsequences && item.isSequence()) {
                item.clearAllBreakpoints(true)
            }
        })

        return this
    }

    /**
     * Find the first connected event that is the input of a node
     * @param actionId The id of the node to find the event for
     * @param event The event information
     * @param event.connectionName The output name of the link from the event node
     * @deprecated
     */
    public findConnectedEvent (
        actionId: string,
        event: { 
            id: string; 
            /**
             * @deprecated
             */
            connectioName?: string
            connectionName?: string 
        }
    ): SequenceItemType | undefined {
        return this.util.findConnectedEvent(actionId, event)
    }

    /**
     * Get all items in this sequence with the same class
     * @param item The item to use as reference
     * @deprecated
     */
    public filterByClassName (
        item: SequenceItemType | Sequence
    ): (SequenceItemType | Sequence)[] {
        return this.util.filterByClassName(item)
    }

    /**
     * List all connected items to an item in this sequence
     * @param itemId The link id of the item
     * @param outputConnection The output connection name to find only items to this link
     * @deprecated
     */
    public listConnectedItems (
        itemId: string,
        outputConnection?: string
    ): string[] {
        return this.util.listConnectedItems(itemId, outputConnection)
    }

    /**
     * Returns the index of the first occurrence of an item in this sequence, or -1 if it is not present.
     * @param id 
     * @deprecated
     */
    public indexOf (id: string): number {
        return this.util.indexOf(id)
    }

    /** @deprecated Use {@link Sequence.updateItem} instead */
    public replaceItem (
        linkId: string,
        newItem: SequenceItemType | Sequence
    ): void {
        this.updateItem(linkId, newItem)
    }

    /**
     * Resolve an id to an item in this sequence
     * @param id The id to search
     */
    public resolveId (
        id: string | ProcessId
    ): SequenceItemType | Sequence | null {
        return (
            this.items.find(n => {
                return typeof id === 'string'
                    ? n.id.equals(id) || n.linkId === id
                    : n.id.equalIds(id)
            }, null) ?? null
        ) // TODO: TS doesn't type thisArg
    }

    public resolve (item: SequenceResolvable) {
        const id = typeof item !== 'string' && 'linkId' in item ? item.id : item

        return this.resolveId(id)
    }

    /**
     * Disable this sequence
     */
    public setDisabled (): this {
        this.enabled = false

        return this
    }

    /**
     * Set a new name for this sequence.
     * Cannot be set if this sequence is the main sequence.
     * @param name 
     */
    public setName (name: string): this {
        if (!this.mainSequence) this.name = name

        return this
    }

    /**
     * Set view options for this sequence
     * @param options The default view options
     */
    public setView (options: SequenceViewOptions): this {
        const { x, y, zoom } = options

        if (x) this.defaultView.x = x
        if (y) this.defaultView.y = y
        if (zoom) this.defaultView.zoom = zoom

        return this
    }

    public update (item: Sequence | SequenceItemType): this | undefined {
        return this.updateItem(item.linkId, item)
    }

    public updateItem (item: SequenceResolvable, updatedItem: Sequence | SequenceItemType): this | undefined {
        const linkId = this.resolve(item)?.linkId
        if (!linkId) return undefined

        const foundItem = this.items.find(n => n.linkId === linkId)

        if (!foundItem) {
            console.warn(
                `Could not find item with id: ${linkId}`
            )
            return
        }

        this.items[this.items.indexOf(foundItem)] = updatedItem

        return this
    }

    public updateItems (items: [SequenceResolvable, (SequenceItemType | Sequence)][]): this {
        items.forEach(([oldItem, newItem]) => this.updateItem(oldItem, newItem))

        return this
    }

    public toJSON (): Record<string, KismetVariableValue> {
        this.items = this.positionManager.fillPositions(this)['items']

        const variables = new SequenceUtil(this)['toRecord'](this.items, this.properties)

        return variables.reduce(
            (prev, curr) => ({
                ...prev,
                [curr[0]]: curr[1],
            }),
            {}
        )
    }

    public toString (): string {
        const json = this.toJSON()

        const lines = !this.mainSequence
            ? [
                  KISMET_NODE_LINES.begin(this.name, 'Sequence'),
                  filterEmptyLines(this.items.map(i => i.toString())),
                  filterEmptyLines(
                      Object.keys(json).map(v => parseVar(v, json[v]))
                  ),
                  KISMET_NODE_LINES.end,
              ]
            : [filterEmptyLines(this.items.map(i => i.toString()))]

        return lines.join('\n')
    }
}

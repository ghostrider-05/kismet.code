import {
    Constants,
    convertVariablesRecordToArray,
    filterEmptyLines,
    KismetItemFormatter
} from '@kismet.ts/shared'

import { BaseItem } from '../item/index.js'
import { SequenceUtil } from './baseUtil.js'

import {
    ProcessManager,
    ProcessId,
    SequencePositionManager,
    SequenceGridManager,
} from '../managers/index.js'

import type {
    SequenceItemType,
    SchemaItemNames,
    KismetVariableValue,
} from './types.js'

import type {
    SequenceViewOptions,
    SequenceOptions,
    SequenceBaseConstructorOptions,
    layoutOptions,
} from './options.js'

const { DefaultMainSequenceName, NodeType } =
    Constants

export const DefaultLayoutOptions: Required<layoutOptions> = {
    startX: 500,
    startY: 500,
    spaceBetween: 200,
}

export type SequenceItemResolvable = string | ProcessId | SequenceItemType
export type SequenceResolvable = Sequence | SequenceItemResolvable
export type SequenceClearType =
    | 'breakpoints'
    | 'items'

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
     * The id of the parent sequence to this sequence
     */
    public parentId: ProcessId | undefined

    /**
     * Whether this sequence can be edited
     */
    public enabled = true

    /**
     * The parent sequence of this sequence.
     * @deprecated
     */
    public parentSequence: string = Sequence.DefaultFormattedSequenceName

    /**
     * The items that are added to this sequence
     */
    public items: (SequenceItemType | Sequence)[] = []

    /**
     * The subsequences that are added in this sequence
     */
    public get subSequences (): Sequence[] {
        return this.items.filter((item): item is Sequence => item.isSequence())
    }

    private kismet: { x: number; y: number }
    private positionManager: SequencePositionManager
    private readonly mainSequence: boolean
    public hasBreakpoint = false

    public readonly grid: SequenceGridManager;

    constructor (private options?: SequenceBaseConstructorOptions<SchemaItemNames>) {
        super(NodeType.SEQUENCES)

        const { name, mainSequence, defaultView, layout, project, index } =
            options ?? {}

        this.id = ProcessManager.id('Sequence', { id: project, index })
        this.parentId = options?.parent

        this.mainSequence = mainSequence ?? false
        this.name = name ?? (this.mainSequence ? DefaultMainSequenceName : 'Sub_Sequence')

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

        this.grid = new SequenceGridManager(options?.grid ?? { grid: 8 });
    }

    private get rawData () {
        return {
            ObjectArchetype: `Sequence'Engine.Default__Sequence'`,
            ObjInstanceVersion: 1,
            DrawHeight: 0,
            DrawWidth: 0,
            ObjPosX: this.kismet.x,
            ObjPosY: this.kismet.y,
        }
    }

    public static formatSequenceReference (name: string): string {
        return `Sequence'${name}'`
    }

    public static get DefaultFormattedSequenceName (): string {
        return Sequence.formatSequenceReference(DefaultMainSequenceName)
    }

    public get util (): SequenceUtil {
        return new SequenceUtil(this)
    }

    public get linkId (): string {
        return Sequence.formatSequenceReference(this.name)
    }

    public isMainSequence (): boolean {
        return this.mainSequence
    }

    public addItem (item: SequenceItemType, overwriteSequence?: boolean): this {
        if (this.items.find(i => i.linkId === item.linkId)) return this

        if (overwriteSequence ?? true) item.setSequence(this, false)

        this.items.push(item)

        return this
    }

    public addItems (items: SequenceItemType[], overwriteSequence?: boolean): this {
        items.forEach(item => this.addItem(item, overwriteSequence))

        return this
    }

    public addSubSequence(sequence: Sequence): { subSequence: Sequence; sequence: Sequence };
    public addSubSequence(options: SequenceOptions<SequenceItemType, SchemaItemNames>): { subSequence: Sequence; sequence: Sequence };
    public addSubSequence (options: Sequence | SequenceOptions<SequenceItemType, SchemaItemNames>): { subSequence: Sequence; sequence: Sequence } {
        if (options instanceof Sequence) {
            options.parentId = this.id
            options.parentSequence = this.linkId

            this.items.push(options)

            return {
                subSequence: options,
                sequence: this,
            }
        } else {
            const {
                name,
                objects,
                layout,
                defaultView,
            } = options

            const subSequence = new Sequence({
                layout: {
                    position: layout?.position ?? this.positionManager.options,
                    schema: layout?.schema,
                    style: layout?.style,
                },
                name,
                defaultView,
                project: this.project,
                parent: this.id,
            }).addItems(objects?.map(x => x.setSequence(name)) ?? [])

            subSequence.parentSequence = this.linkId
            this.items.push(subSequence)

            return {
                subSequence,
                sequence: this,
            }
        }
    }

    /**
     * Clear all @type on items in this sequence
     * @param type The type of clear to perform
     * - breakpoints: remove all breakpoints on item nodes
     * - items: remove all items, except for subsequences
     * @param includeSubsequences Whether to clear breakpoints in subsequences (default false)
     * 
     */
    public clear (type: SequenceClearType, includeSubsequences?: boolean): this {
        if (type === 'items') {
            this.items = this.items.filter(n => n.isSequence())
        }

        for (const item of this.items) {
            if (item.isSequenceNode()) {
                if (type === 'breakpoints') {
                    this.update(item.setBreakpoint(false))
                }

            } else if (includeSubsequences && item.isSequence()) {
                this.update(item.clear(type, includeSubsequences))
            }
        }

        return this
    }

    /**
     * Clear all breakpoints on items in this sequence
     * @param includeSubsequences Whether to clear breakpoints in subsequences (default false)
     * @deprecated
     */
    public clearAllBreakpoints (includeSubsequences?: boolean): this {
        return this.clear('breakpoints', includeSubsequences)
    }

    public debug (input: string): boolean {
        return ProcessManager.debug(input, this.project)?.completed ?? false
    }

    /**
     * Resolve an id to an item in this sequence
     * @param id The id to search
     */
    public resolveId (
        id: string | ProcessId
    ): SequenceItemType | Sequence | null {
        return this.items.find(n => {
            return typeof id === 'string'
                ? n.id.equals(id) || n.linkId === id
                : n.id.equalIds(id)
        }, null) ?? null
    }

    public resolve (item: SequenceResolvable) {
        const id = typeof item !== 'string' && 'linkId' in item ? item.id : item

        return this.resolveId(id)
    }

    /**
     * Set / remove a breakpoint on this sequence
     */
    public setBreakpoint (enabled: boolean): this {
        this.hasBreakpoint = enabled

        return this
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
        if (!this.isMainSequence()) this.name = name

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

    public update (...items: (Sequence | SequenceItemType)[]): void {
        for (const item of items) {
            this.updateItem(item.linkId, item)
        }
    }

    /** @deprecated */
    public updateItem (
        item: SequenceResolvable,
        updatedItem: Sequence | SequenceItemType
    ): void {
        const linkId = this.resolve(item)?.linkId
        if (!linkId) return undefined

        const foundItem = this.items.find(n => n.linkId === linkId)

        if (!foundItem) {
            console.warn(`Could not find item with id: ${linkId}`)
            return
        }

        this.items[this.items.indexOf(foundItem)] = updatedItem
    }

    /** @deprecated */
    public updateItems (
        items: [SequenceResolvable, SequenceItemType | Sequence][]
    ): void {
        items.forEach(([oldItem, newItem]) => this.updateItem(oldItem, newItem))
    }

    public toJSON (): Record<string, KismetVariableValue> {
        this.items = this.positionManager.fillPositions(this)['items']
        this.grid.applyGridToSequence(this)

        const variables = this.util['toRecord'](
            this.items,
            this.rawData
        )

        if (this.hasBreakpoint) variables.push(['bIsBreakpoinSet', 'True'])

        return variables.reduce(
            (prev, curr) => ({
                ...prev,
                [curr[0]]: curr[1],
            }),
            {}
        )
    }

    public toString (): string {
        const variables = convertVariablesRecordToArray(this.toJSON())

        const lines = !this.mainSequence
            ? KismetItemFormatter.format(this.name, 'Sequence', variables)
            : [
                filterEmptyLines(this.items.map(i => i.toString()))
            ].join(KismetItemFormatter.joinCharacter)

        return lines
    }
}

import { BaseItem } from './Item/_base.js'

import {
    ProcessManager,
    ProcessId,
    SequencePositionManager,
} from '../managers/index.js'

import {
    boolToKismet,
    Constants,
    filterEmptyLines,
    parseVar,
} from '../../shared/index.js'

import type {
    KismetVariablesType,
    KismetVariableInternalTypeList,
    SequenceItemType,
    SequenceViewOptions,
    SequenceOptions,
    SequenceBaseConstructorOptions,
    SchemaItemNames,
} from '../../types/index.js'

const { DefaultLayoutOptions, KISMET_NODE_LINES, MAIN_SEQUENCE, NodeType } =
    Constants

export class Sequence extends BaseItem {
    public name: string
    public defaultView: Required<SequenceViewOptions>

    public readonly id: ProcessId
    public readonly project?: ProcessId

    public enabled = true
    public parentSequence: string = MAIN_SEQUENCE

    public items: (SequenceItemType | Sequence)[] = []
    public subSequences: Sequence[] = []

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
        }
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

        this.subSequences.push(subSequence)
        this.items.push(subSequence)

        return {
            subSequence,
            sequence: this,
        }
    }

    public findConnectedEvent (
        actionId: string,
        event: { id: string; connectioName?: string }
    ): SequenceItemType | undefined {
        const events = this.items.filter(n => {
            if (n.isEvent() && n.linkId === event.id) {
                const connectedItems = this.listConnectedItems(event.id)

                return connectedItems.includes(actionId)
            } else return false
        })

        return events.length > 0 ? <SequenceItemType>events[0] : undefined
    }

    public filterByClassName (
        item: SequenceItemType | Sequence
    ): (SequenceItemType | Sequence)[] {
        return this.items.filter(
            n => n.linkId.split("'")[0] === item.linkId.split("'")[0]
        )
    }

    public listConnectedItems (
        itemId: string,
        outputConnection?: string
    ): string[] {
        const item = this.resolveId(itemId)

        if (item?.isSequenceItem()) {
            const ids = item.connections?.output.flatMap(link =>
                link.name === (outputConnection ?? link.name)
                    ? link.linkedIds
                    : []
            )
            if (!ids || ids.length === 0) return []

            let idsToFilter = ids

            while (idsToFilter.length <= this.items.length) {
                const cItems = idsToFilter
                    .map(id => this.resolveId(id))
                    .filter(n => n)
                const newIds: string[] = cItems
                    .flatMap(i =>
                        i?.isSequenceItem() && !idsToFilter.includes(i.linkId)
                            ? i.connections?.output.flatMap(
                                  link => link.linkedIds
                              )
                            : undefined
                    )
                    .filter(n => n) as string[]

                if (newIds.length > 0) {
                    idsToFilter = idsToFilter.concat(newIds)
                } else {
                    break
                }
            }

            return idsToFilter
        } else return []
    }

    public indexOf (id: string): number {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.items.indexOf(this.items.find(i => i.linkId === id)!)
    }

    public replaceItem (
        linkId: string,
        newItem: SequenceItemType | Sequence
    ): void {
        const item = this.items.find(n => n.linkId === linkId)

        if (!item) {
            return console.warn(
                `Could not find replacement item with id: ${linkId}`
            )
        }

        this.items[this.items.indexOf(item)] = newItem
    }

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

    public setDisabled (): this {
        this.enabled = false

        return this
    }

    public setName (name: string): this {
        this.name = name

        return this
    }

    public setView (options: SequenceViewOptions): this {
        const { x, y, zoom } = options

        if (x) this.defaultView.x = x
        if (y) this.defaultView.y = y
        if (zoom) this.defaultView.zoom = zoom

        return this
    }

    public toJSON (): Record<string, KismetVariablesType> {
        const { archetype, ObjInstanceVersion, DrawHeight, DrawWidth } =
            this.properties

        this.items = this.positionManager.fillPositions(this)['items']

        const variables = this.items
            .map<[string, KismetVariablesType]>((item, i) => [
                `SequenceObjects(${i})`,
                item.linkId,
            ])
            .concat([
                ['ObjectArchetype', archetype],
                ['ObjName', this.name],
                ['ObjInstanceVersion', ObjInstanceVersion],
                ['DrawWidth', DrawWidth],
                ['DrawHeight', DrawHeight],
                ['Name', this.name],
                ['ObjPosX', this.kismet.x],
                ['ObjPosY', this.kismet.y],
                ['ParentSequence', this.parentSequence],
                ['bEnabled', boolToKismet(this.enabled)],
                ['DefaultViewX', this.defaultView.x],
                ['DefaultViewY', this.defaultView.y],
                ['DefaultViewZoom', this.defaultView.zoom],
            ]) as KismetVariableInternalTypeList

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

    /**
     * @deprecated
     */
    public toKismet (): string {
        return this.toString()
    }
}

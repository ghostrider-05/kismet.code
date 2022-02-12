import { 
    ProcessManager,
    ProcessId,
    SequencePositionManager 
} from '../managers/index.js'

import { 
    boolToKismet, 
    Constants,
    filterEmptyLines, 
    parseVar 
} from '../../shared/index.js'

import type { 
    KismetVariablesType, 
    KismetVariableInternalTypeList, 
    SequenceItemType, 
    SequenceViewOptions,
    SequenceOptions,
    SequenceBaseConstructorOptions,
    SchemaItemNames,
    SequenceItemTypeName
} from '../../types/index.js'

const {
    DefaultLayoutOptions,
    KISMET_NODE_LINES,
    MAIN_SEQUENCE
} = Constants

export class Sequence {
    public name: string;
    public subSequences: Sequence[];
    public defaultView: Required<SequenceViewOptions>;

    public readonly id: ProcessId;
    public readonly type: SequenceItemTypeName = 'sequences'

    public enabled: boolean;
    public parentSequence: string;

    private items: (SequenceItemType | Sequence)[];
    private kismet: { x: number; y: number; };
    private positionManager: SequencePositionManager;
    private mainSequence: boolean;

    constructor (options: SequenceBaseConstructorOptions<SchemaItemNames>) {
        const { name, mainSequence, defaultView, layout } = options

        this.name = name ?? 'Sub_Sequence'
        this.id = ProcessManager.id('Sequence')
        this.items = []

        this.subSequences = []
        this.parentSequence = MAIN_SEQUENCE

        this.enabled = true
        this.mainSequence = mainSequence ?? false

        this.kismet = {
            x: 0,
            y: 0
        }

        this.defaultView = {
            x: defaultView?.x ?? 0,
            y: defaultView?.y ?? 0,
            zoom: defaultView?.zoom ?? 1
        }

        this.positionManager = new SequencePositionManager({
            layoutOptions: layout?.position ?? DefaultLayoutOptions,
            style: layout?.style,
            schema: layout?.schema
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
            DrawWidth
        }
    }

    public get linkId (): string {
        return `Sequence'${this.name}'`
    }

    public addItem (item: SequenceItemType): this {      
        item.setSequence(this)

        this.items.push(item)

        return this
    }

    public addItems (items: SequenceItemType[]): this {
        items.forEach(item => this.addItem(item))

        return this
    }

    public addSubSequence ({ name, objects, layout, defaultView } : SequenceOptions<SequenceItemType, SchemaItemNames>): Sequence {
        const subSequence = new Sequence({ 
            layout: {
                position: layout?.position ?? this.positionManager.options,
                schema: layout?.schema,
                style: layout?.style
            },
            name,
            defaultView
        }).addItems(objects?.map(x => x.setSequence(name)) ?? [])

        this.subSequences.push(subSequence)
        this.items.push(subSequence)

        subSequence.parentSequence = this.linkId

        return subSequence
    }

    public find (id: string): SequenceItemType | Sequence | null {
        return this.items.find(n => n.id.equals(id)) ?? null
    }

    public filterByClassName (item: SequenceItemType | Sequence): (SequenceItemType | Sequence)[] {
        return this.items.filter(n => n.linkId.split('\'')[0] === item.linkId.split('\'')[0])
    }

    public replaceItem (linkId: string, newItem: (SequenceItemType | Sequence)): void {
        const item = this.items.find(n => n.linkId === linkId)

        if (!item) {
            return console.warn(`Could not find replacement item with id: ${linkId}`)
        }

        this.items[this.items.indexOf(item)] = newItem
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

    public toKismet(): string {
        const { 
            archetype, 
            ObjInstanceVersion, 
            DrawHeight, 
            DrawWidth 
        } = this.properties

        this.positionManager.fillPositions(this)

        const variables = this.items.map<[string, KismetVariablesType]>((item, i) => [`SequenceObjects(${i})`, item.linkId])
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
                ['DefaultViewZoom', this.defaultView.zoom]
            ]) as KismetVariableInternalTypeList

        const lines = !this.mainSequence ? [
            KISMET_NODE_LINES.begin(this.name, 'Sequence'),
            filterEmptyLines(this.items.map(i => i.toKismet())),
            filterEmptyLines(variables.map(v => parseVar(v[0], v[1]))),
            KISMET_NODE_LINES.end
        ] : [
            filterEmptyLines(this.items.map(i => i.toKismet()))
        ]

        return lines.join('\n')
    }
}

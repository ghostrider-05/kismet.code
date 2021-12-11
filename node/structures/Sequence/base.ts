import { SequencePositionManager } from './misc/PositionManager.js'

import { 
    boolToKismet, 
    Constants,
    filterEmptyLines, 
    parseVar 
} from '../../shared/index.js'

import type { 
    layoutOptions,
    KismetVariableInternalType, 
    KismetVariableInternalTypeList, 
    SequenceItemType 
} from '../../types/index.js'

const {
    KISMET_NODE_LINES,
    MAIN_SEQUENCE
} = Constants

export class Sequence {
    public name: string;
    public subSequences: Sequence[];

    public enabled: boolean;
    public parentSequence: string;

    private items: (SequenceItemType | Sequence)[];
    private kismet: { ObjPosX: number; ObjPosY: number; };
    private positionManager: SequencePositionManager;
    private mainSequence: boolean;

    constructor (options: { name?: string, layoutOptions: Required<layoutOptions>, mainSequence?: boolean }) {
        const { name, layoutOptions, mainSequence } = options

        this.name = name ?? 'Sub_Sequence'
        this.items = []

        this.subSequences = []
        this.parentSequence = MAIN_SEQUENCE

        this.enabled = true
        this.mainSequence = mainSequence ?? false

        this.kismet = {
            ObjPosX: 0,
            ObjPosY: 0
        }

        this.positionManager = new SequencePositionManager({
            layoutOptions
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

        const [x, y] = this.positionManager.addItem(item)

        const setPosition = (item: SequenceItemType, cords: [number, number]): SequenceItemType => {
            item['kismet']['x'] = cords[0]
            item['kismet']['y'] = cords[1]

            return item
        }

        this.items.push(setPosition(item, [x, y]))

        return this
    }

    public addItems (items: SequenceItemType[]): this {
        items.forEach(item => this.addItem(item))

        return this
    }

    public addSubSequence (name: string, objects?: SequenceItemType[]): Sequence {
        const subSequence = new Sequence({ layoutOptions: this.positionManager.options, name })
            .addItems(objects?.map(x => x.setSequence(name)) ?? [])

        this.subSequences.push(subSequence)
        this.items.push(subSequence)

        subSequence.parentSequence = this.linkId

        return subSequence
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

    public toKismet(): string {
        const { 
            archetype, 
            ObjInstanceVersion, 
            DrawHeight, 
            DrawWidth 
        } = this.properties

        const variables = this.items.map<[string, KismetVariableInternalType]>((item, i) => [`SequenceObjects(${i})`, item.linkId])
            .concat([
                ['ObjectArchetype', archetype],
                ['ObjName', this.name],
                ['ObjInstanceVersion', ObjInstanceVersion],
                ['DrawWidth', DrawWidth],
                ['DrawHeight', DrawHeight],
                ['Name', this.name],
                ['ObjPosX', this.kismet.ObjPosX],
                ['ObjPosY', this.kismet.ObjPosY],
                ['ParentSequence', this.parentSequence],
                ['bEnabled', boolToKismet(this.enabled)]
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

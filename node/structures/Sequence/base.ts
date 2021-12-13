import { 
    boolToKismet, 
    Constants,
    filterEmptyLines, 
    parseVar 
} from '../../shared/index.js';

import type { 
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

    constructor (name?: string) {
        this.name = name ?? 'Sub_Sequence'
        this.items = []

        this.subSequences = []
        this.parentSequence = MAIN_SEQUENCE

        this.enabled = true

        this.kismet = {
            ObjPosX: 0,
            ObjPosY: 0
        }
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

    public addSubSequence (name: string, objects?: SequenceItemType[]): Sequence {
        const subSequence = new Sequence(name)
            .addItems(objects?.map(x => x.setSequence(name)) ?? [])

        this.subSequences.push(subSequence)
        this.items.push(subSequence)

        subSequence.parentSequence = this.linkId

        return subSequence
    }

    public filterByClassName (className: string): (SequenceItemType | Sequence)[] {
        return this.items.filter(n => n.linkId.split('\'')[0] === className)
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

        const lines = [
            KISMET_NODE_LINES.begin(this.name, 'Sequence'),
            filterEmptyLines(this.items.map(i => i.toKismet())),
            filterEmptyLines(variables.map(v => parseVar(v[0], v[1]))),
            KISMET_NODE_LINES.end
        ]

        return lines.join('\n')
    }
}

import { 
    boolToKismet, 
    Constants,
    filterEmptyLines, 
    parseVar 
} from '../../shared/index.js';

import type { 
    KismetVariableInternalTypeList, 
    KismetVariablesType, 
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

    public toJSON (): Record<string, KismetVariablesType> {
        const { 
            archetype, 
            ObjInstanceVersion, 
            DrawHeight, 
            DrawWidth 
        } = this.properties

        const variables = this.items.map<[string, KismetVariablesType]>((item, i) => [`SequenceObjects(${i})`, item.linkId])
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

        return variables.reduce((prev, curr) => ({
            ...prev,
            [curr[0]]: curr[1]
        }), {})
    }

    public toString (): string {
        const json = this.toJSON()

        const lines = [
            KISMET_NODE_LINES.begin(this.name, 'Sequence'),
            filterEmptyLines(this.items.map(i => i.toString())),
            filterEmptyLines(Object.keys(json).map(v => parseVar(v, json[v]))),
            KISMET_NODE_LINES.end
        ]

        return lines.join('\n')
    }

    /**
     * @deprecated 
     */
    public toKismet(): string {
        return this.toString()
    }
}

import { SequenceVariable, KismetVariableOptions, UDKContentBrowserObject, SequenceItemType, KismetBoolean } from "@kismet.ts/core"

export class ObjectVariable extends SequenceVariable {
    public value: UDKContentBrowserObject;

    constructor (options?: KismetVariableOptions) {
        super({
            ...options,
            ObjectArchetype: `SeqVar_Object'Engine.Default__SeqVar_Object'`,
            inputs: {}
        })

        this.value = ''
    }

    public setValue (value: UDKContentBrowserObject): this {
        this.value = value

        return this
    }

    public override toString (): string {
        this.raw.push(['ObjValue', this.value === '' ? 'None' : this.value])

        return super.toString()
    }
}

export class ObjectListVariable extends ObjectVariable {
    public values: UDKContentBrowserObject[];

    constructor (options?: KismetVariableOptions) {
        super(options)

        this.values = []

        this.rawData.ObjectArchetype = `SeqVar_ObjectList'Engine.Default__SeqVar_ObjectList'`
    }

    public addItem (item: UDKContentBrowserObject): this {
        this.values.push(item)

        return this
    }

    public addItems (items: UDKContentBrowserObject[]): this {
        items.forEach(item => this.addItem(item))

        return this
    }

    public override toString (): string {
        const values: [string, string][] = this.values.map((value, i) => [`ObjList(${i})`, value])
        this.raw.push(...values)
        
        return super.toString()
    }
}

export class ObjectVolumeVariable extends ObjectVariable {
    public collidingOnly = true;
    public excludeClasses: string[] = [
        `Class'Engine.Trigger'`,
        `Class'Engine.Volume'`
    ]

    constructor (options?: KismetVariableOptions) {
        super(options)

        this.rawData.ObjectArchetype = `SeqVar_ObjectVolume'Engine.Default__SeqVar_ObjectVolume'`
    }

    public excludeClass (item: SequenceItemType): this {
        this.excludeClasses.push(item.ClassData.ClassType)

        return this
    }

    public setCollidingOnly (enabled: boolean): this {
        this.collidingOnly = enabled

        return this
    }

    public override toString (): string {
        const classList: [string, string][] = this.excludeClasses.map((Class, i) => {
            return [`ExcludeClassList(${i})`, Class]
        })
        const properties:[string, string][] = [
            ...classList,
            ['bCollidingOnly', KismetBoolean.toKismet(this.collidingOnly)]
        ]

        this.raw.push(...properties)

        return super.toString()
    }
}
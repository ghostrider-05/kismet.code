import {
    boolToKismet,
    parseVar,
    t,
    Constants
} from '../../../shared/index.js'

import type {
    BaseKismetConnectionOptions,
    KismetConnectionType
} from '../../../types/index.js'

export class BaseKismetConnection {
    protected readonly type: KismetConnectionType;
    protected kismet: BaseKismetConnectionOptions;
    
    public name: string;
    public connectionIndex = 0;
    
    public links: string[] | null = null;
    public bHidden: boolean;

    constructor (options: { 
        input: string, 
        type: KismetConnectionType, 
        index?: number,
        kismetOptions?: BaseKismetConnectionOptions 
    }) {
        const { input, type, kismetOptions, index } = options

        this.name = input
        this.connectionIndex = index ?? 0

        this.bHidden = true

        this.type = type
        this.kismet = kismetOptions ?? {
            Draw: 0,
            OverrideDelta: 0
        }
    }

    public static convertLink (type: KismetConnectionType, input: string, index?: number): ItemConnection | VariableConnection | undefined {
        switch (type) {
            case Constants.ConnectionType.INPUT || Constants.ConnectionType.OUTPUT:
                return new ItemConnection(input, type, index)
            case Constants.ConnectionType.VARIABLE:
                return new VariableConnection(input, type, index)
            default:
                console.warn('Unknown connection link type: ' + type)
        }
    }

    public static convertInput (input: string): Record<string, string | number | boolean> {
        return input.slice(1, -1).split(',').map(prop => {
            return {
                name: prop.substring(0, prop.indexOf('=')),
                value: prop.substring(prop.indexOf('=') + 1)
            }
        }).reduce((z, a) => ({...z, [a.name]: a.value}), {})
    }

    private get typeName () : string {
        return (this.type[0].toUpperCase() + this.type.slice(1)) + 'Links'
    }

    private get formatted (): string {
        const base = [
            `OverrideDelta=${this.kismet.OverrideDelta}`
        ].concat(!this.bHidden && this.type === 'variable' ? [`bHidden=${boolToKismet(this.bHidden)}`] : [])

        const prefix = this.type === 'variable' ? 'LinkedVariables' : 'Links'
        const Draw = `${this.type === 'variable' ? 'DrawX' : 'DrawY'}=${this.kismet.Draw}`
        const linksLength = this.links?.length ?? 0

        return base.concat([Draw].concat(linksLength > 0 ? [
            `${prefix}=(${this.links?.join(',')})`
        ] : [])).join(',')
    }

    public addLink (linkId: string, index?: number, hidden?: boolean): this {
        if (this.links == undefined) {
            this.links = []
        }

        if (hidden != undefined) {
            this.bHidden = hidden
        }

        const linkIndex = typeof index === 'number' && (index ?? 0) > 0 ? `,InputLinkIdx=${index}` : ''
        const link = this.type !== 'variable' ? `(LinkedOp=${linkId}${linkIndex})` : linkId
            
        this.links.push(link)

        return this
    }

    public setHidden (hidden: boolean): this {
        this.bHidden = hidden

        return this
    }

    public toKismet (index?: number): string {
        return parseVar(`${this.typeName}(${index ?? this.connectionIndex})`, `(${this.formatted})`)
    }
}

export class VariableConnection extends BaseKismetConnection {
    expectedType: string;
    PropertyName: string;
    bAllowAnyType: boolean;
    CachedProperty: boolean;
    MinVars: number;
    MaxVars: number;
    DrawX: number;
    bWriteable: boolean;
    bSequenceNeverReadsOnlyWritesToThisVar: boolean;
    bModifiesLinkedObject: boolean;

    constructor (input: string, type: KismetConnectionType, index?: number ) {
        super({
            input,
            index,
            type
        })

        const properties = BaseKismetConnection.convertInput(input)

        const {
            ExpectedType,
            PropertyName,
            bAllowAnyType,
            CachedProperty,
            MinVars,
            MaxVars,
            DrawX,
            bWriteable,
            bSequenceNeverReadsOnlyWritesToThisVar,
            bModifiesLinkedObject
        } = properties

        this.expectedType = t(ExpectedType);
        this.PropertyName = t(PropertyName);
        this.bAllowAnyType = t(bAllowAnyType) ?? false;
        this.CachedProperty = t(CachedProperty) ?? null;
        this.MinVars = t(MinVars) ?? 1;
        this.MaxVars = t(MaxVars) ?? 255;
        this.DrawX = t(DrawX) ?? 0;
        this.bWriteable = t(bWriteable) ?? false;
        this.bSequenceNeverReadsOnlyWritesToThisVar = t(bSequenceNeverReadsOnlyWritesToThisVar) ?? false;
        this.bModifiesLinkedObject = t(bModifiesLinkedObject) ?? false;
    }

    public override addLink(linkId: string, index?: number, hidden?: boolean): this {
        if ((this.links?.length ?? 0) > this.MaxVars) {
            console.warn(`Maximum connections reached (${this.MaxVars}). Cannot add more connections to ${linkId}`)
        }

        const expectedClass = this.expectedType.split("'")[1].split('.')[1]

        if (!this.bAllowAnyType && (linkId.split("'")[0] !== expectedClass)) {
            console.warn(`Incorrect input type. Received class ${linkId.split("'")[0]}, expected ${expectedClass}`)
        }

        super.addLink(linkId, index, hidden)

        return this
    }

    public override toKismet(index?: number): string {
        return super.toKismet(index)
    }
}

export class ItemConnection extends BaseKismetConnection {
    public bHasImpulse: boolean;
    public bDisabled: boolean;
    public bDisabledPIE: boolean;
    public ActivateDelay: number;
    public LinkedOp: string;
    public DrawY: number;

    constructor (input: string, type: KismetConnectionType, index?: number) {
        super({
            input,
            type,
            index
        })

        const properties = BaseKismetConnection.convertInput(input)

        const {
            bHasImpulse,
            bDisabled,
            bDisabledPIE,
            ActivateDelay,
            LinkedOp,
            DrawY
        } = properties

        this.bHasImpulse = t(bHasImpulse) ?? false;
        this.bDisabled = t(bDisabled) ?? false;
        this.bDisabledPIE = t(bDisabledPIE) ?? false;
        this.ActivateDelay = t(ActivateDelay) ?? 0.0;
        this.LinkedOp = t(LinkedOp) ?? null;
        this.DrawY = t(DrawY) ?? 0;
    }

    public setActivateDelay = (duration: number): this => {
        this.ActivateDelay = duration;

        return this
    }

    public isInputLink (): boolean {
        return this.type === 'input'
    }

    public isOutputLink (): boolean {
        return this.type === 'output'
    }
}
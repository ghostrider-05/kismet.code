import {
    capitalize,
    cast,
    Constants,
    KismetError,
    KismetItemFormatter,
} from '@kismet.ts/shared'

import { KismetBoolean } from '../util/index.js'

export type KismetVariableLinkConnection = string

export type KismetConnectionType = 'input' | 'variable' | 'output'

export type KismetConnection = ItemConnection | VariableConnection

export interface KismetConnections extends Record<string, BaseKismetConnection[]> {
    input: ItemConnection[]
    output: ItemConnection[]
    variable: VariableConnection[]
}

export interface BaseKismetConnectionOptions {
    Draw: number
    OverrideDelta: number
}

export class BaseKismetConnection {
    private baseConnection: boolean
    protected readonly type: KismetConnectionType
    protected kismet: BaseKismetConnectionOptions
    protected input: string

    public name: string
    /** @deprecated */
    public connectionIndex = 0

    public index = 0

    public links: string[] | null = null
    public linkedIds: string[] = []

    private _hidden: boolean | null = null
    public get bHidden (): boolean { return this._hidden ?? false }
    public expanded: boolean

    constructor (options: {
        input: string
        type: KismetConnectionType
        index?: number
        kismetOptions?: BaseKismetConnectionOptions
        extends?: boolean,
        expanded?: boolean,
    }) {
        const { input, type, kismetOptions, index } = options

        this.input = input

        this.name = input
        this.connectionIndex = index ?? 0
        this.index = index ?? 0
        this.expanded = options.expanded ?? false

        this.type = type
        this.baseConnection = !(options.extends ?? false)
        this.kismet = kismetOptions ?? {
            Draw: 0,
            OverrideDelta: 0,
        }
    }

    public static convertLink <T extends KismetConnectionType> (
        type: T,
        input: string,
        index?: number
    ): KismetConnections[T][number] | undefined {
        switch (type) {
            case Constants.ConnectionType.INPUT:
            case Constants.ConnectionType.OUTPUT:
                return new ItemConnection(input, type, index)
            case Constants.ConnectionType.VARIABLE:
                return new VariableConnection(input, type, index)
            default:
                console.warn('Unknown connection link type: ' + type)
        }
    }

    public static convertInput (
        input: string
    ): Record<string, string | number | boolean> {
        const output = input
            .slice(1, -1)
            .split(',')
            .map(prop => {
                return {
                    name: prop.substring(0, prop.indexOf('=')),
                    value: prop.substring(prop.indexOf('=') + 1),
                }
            })
            .reduce((z, a) => ({ ...z, [a.name]: a.value }), {})

        return output
    }

    public static getTypeName (type: KismetConnectionType): string {
        return capitalize(type) + 'Links'
    }

    protected format (keys?: string[]): string {
        const base = [
            ...(keys ?? []),
            `OverrideDelta=${this.kismet.OverrideDelta}`,
        ].concat(
            typeof this._hidden === 'boolean' && this.type === 'variable'
                ? [`bHidden=${KismetBoolean.toKismet(this.bHidden)}`]
                : [],
        )

        const prefix = this.type === 'variable' ? 'LinkedVariables' : 'Links'
        const Draw = `${this.type === 'variable' ? 'DrawX' : 'DrawY'}=${
            this.kismet.Draw
        }`
        const linksLength = this.links?.length ?? 0

        const output = base
            .concat(
                [Draw].concat(
                    linksLength > 0
                        ? [`${prefix}=(${this.links?.join(',')})`]
                        : []
                )
            )
            .join(',')

        return `(${output})`
    }

    /**
     * Whether the socket currently is being used by having at least one connection with another socket
     */
    public get isUsed (): boolean {
        return this.linkedIds.length > 0
    }

    /**
     * Add a new socket link connection
     * @param linkId The linkId of the (other) item to connect to
     * @param index The index of the input variable socket that will be connected to. 
     * Empty or 0 if the socket is the first input socket on the item
     * @param hidden Change the hidden state of this socket
     */
    public addLink (linkId: string, index?: number, hidden?: boolean): this {
        this.links ??= []

        if (hidden != undefined) {
            this.setHidden(hidden)
        }

        const linkIndex =
            typeof index === 'number' && (index ?? 0) > 0
                ? `,InputLinkIdx=${index}`
                : ''
        const link =
            this.type !== 'variable'
                ? `(LinkedOp=${linkId}${linkIndex})`
                : linkId

        this.links.push(link)
        this.linkedIds.push(linkId)

        return this
    }

    public breakLinkTo (linkId: string): this {
        const index = this.linkedIds.findIndex(id => id === linkId);

        if (index < 0) new KismetError('UNKNOWN_CONNECTION', [linkId, 'connection ' + this.name , this.type])

        this.linkedIds.splice(index, 1)
        this.links?.splice(index, 1)

        return this
    }

    public breakAllLinks (): this {
        this.linkedIds = []
        this.links = []

        return this
    }

    public isBaseConnection (): this is BaseKismetConnection {
        return this.baseConnection
    }

    public isItemConnection (): this is ItemConnection {
        return (
            !this.baseConnection &&
            ItemConnection.isItemConnectionType(this.type)
        )
    }

    public isVariableConnection (): this is VariableConnection {
        return (
            !this.baseConnection &&
            this.type === Constants.ConnectionType.VARIABLE
        )
    }

    public setHidden (hidden: boolean): this {
        this._hidden = hidden

        return this
    }

    public prefix (index?: number): string {
        return `${BaseKismetConnection.getTypeName(this.type)}(${index ?? this.index ?? this.connectionIndex})`
    }

    public get value (): string {
        return this.format()
    }

    public toString (index?: number, value?: string): string {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return KismetItemFormatter.variable(this.prefix(index), value ?? this.value)!
    }
}

export class VariableConnection extends BaseKismetConnection {
    public expectedType: string
    public PropertyName: string
    public bAllowAnyType: boolean
    public CachedProperty: boolean
    public MinVars: number
    public MaxVars: number
    public DrawX: number
    public bWriteable: boolean
    public bSequenceNeverReadsOnlyWritesToThisVar: boolean
    public bModifiesLinkedObject: boolean

    constructor (input: string, type: KismetConnectionType, index?: number, expanded?: boolean) {
        super({
            input,
            index,
            type: Constants.ConnectionType.VARIABLE,
            extends: true,
            expanded,
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
            bModifiesLinkedObject,
            LinkDesc,
        } = properties

        this.name = cast(LinkDesc.toString().replace(/"/g, ''))

        this.expectedType = cast(ExpectedType)
        this.PropertyName = cast(PropertyName)
        this.bAllowAnyType = cast(bAllowAnyType, 'boolean') ?? false
        this.CachedProperty = cast(CachedProperty) ?? null
        this.MinVars = cast(MinVars, 'number') ?? 1
        this.MaxVars = cast(MaxVars, 'number') ?? 255
        this.DrawX = cast(DrawX) ?? 0
        this.bWriteable = cast(bWriteable, 'boolean') ?? false
        this.bSequenceNeverReadsOnlyWritesToThisVar =
            cast(bSequenceNeverReadsOnlyWritesToThisVar, 'boolean') ?? false
        this.bModifiesLinkedObject =
            cast(bModifiesLinkedObject, 'boolean') ?? false
    }

    public override addLink (
        linkId: string,
        index?: number,
        hidden?: boolean
    ): this {
        if ((this.links?.length ?? 0) > this.MaxVars) {
            console.warn(
                `Maximum connections reached (${this.MaxVars}). Cannot add more connections to ${linkId}`
            )
        }

        const expectedClass = this.expectedType?.split("'")[1].split('.')[1]

        if (!this.bAllowAnyType && linkId.split("'")[0] !== expectedClass && expectedClass != undefined) {
            console.warn(
                `Incorrect input type. Received class ${
                    linkId.split("'")[0]
                }, expected ${expectedClass}`
            )
        }

        super.addLink(linkId, index, hidden)

        return this
    }

    public isOutput (): boolean {
        return this.bWriteable
    }

    public override get value (): string {
        return this.format(this.expanded ? [
            `ExpectedType=${this.expectedType}`,
            `LinkDesc="${this.name}"`,
            // `PropertyName=${this.PropertyName}`
        ] : [])
    }

    public override toString (index?: number): string {
        return super.toString(index, this.value)
    }
}

export class ItemConnection extends BaseKismetConnection {
    public bHasImpulse: boolean
    public bDisabled: boolean
    public bDisabledPIE: boolean
    public ActivateDelay: number
    public LinkedOp: string
    public DrawY: number

    constructor (
        input: string,
        type: Exclude<KismetConnectionType, 'variable'>,
        index?: number
    ) {
        super({
            input,
            type,
            index,
            extends: true,
        })

        const properties = BaseKismetConnection.convertInput(input)

        const {
            LinkDesc,
            bHasImpulse,
            bDisabled,
            bDisabledPIE,
            ActivateDelay,
            LinkedOp,
            DrawY,
        } = properties

        this.name = LinkDesc
            ? (<string>LinkDesc).replaceAll('"', '')
            : this.name
        this.bHasImpulse = cast(bHasImpulse, 'boolean') ?? false
        this.bDisabled = cast(bDisabled, 'boolean') ?? false
        this.bDisabledPIE = cast(bDisabledPIE, 'boolean') ?? false
        this.ActivateDelay = cast(ActivateDelay, 'number') ?? 0.0
        this.LinkedOp = cast(LinkedOp, 'number') ?? null
        this.DrawY = cast(DrawY, 'number') ?? 0
    }

    public static isItemConnectionType (type: string): boolean {
        const validTypes = [
            Constants.ConnectionType.INPUT,
            Constants.ConnectionType.OUTPUT,
        ]

        return validTypes.includes(<never>type)
    }

    public setActivateDelay = (duration: number): this => {
        this.ActivateDelay = duration

        return this
    }

    public isInputLink (): boolean {
        return this.type === Constants.ConnectionType.INPUT
    }

    public isOutputLink (): boolean {
        return this.type === Constants.ConnectionType.OUTPUT
    }

    public override get value (): string {
        const delay =
            this.ActivateDelay > 0
                ? [`ActivateDelay=${this.ActivateDelay}`]
                : []

        return super.format(delay)
    }

    public override toString (index?: number): string {
        const kismet = super.toString(index, this.value)

        return kismet
    }
}

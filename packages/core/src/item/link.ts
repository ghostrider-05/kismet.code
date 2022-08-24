import {
    cast,
    Constants,
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
    public connectionIndex = 0

    public links: string[] | null = null
    public linkedIds: string[] = []
    public bHidden: boolean

    constructor (options: {
        input: string
        type: KismetConnectionType
        index?: number
        kismetOptions?: BaseKismetConnectionOptions
        extends?: boolean
    }) {
        const { input, type, kismetOptions, index } = options

        this.input = input

        this.name = input
        this.connectionIndex = index ?? 0

        this.bHidden = false

        this.type = type
        this.baseConnection = !(options.extends ?? false)
        this.kismet = kismetOptions ?? {
            Draw: 0,
            OverrideDelta: 0,
        }
    }

    public static convertLink (
        type: KismetConnectionType,
        input: string,
        index?: number
    ): ItemConnection | VariableConnection | undefined {
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

    private get typeName (): string {
        return this.type[0].toUpperCase() + this.type.slice(1) + 'Links'
    }

    protected format (keys?: string[]): string {
        const base = [
            ...(keys ?? []),
            `OverrideDelta=${this.kismet.OverrideDelta}`,
        ].concat(
            this.bHidden && this.type === 'variable'
                ? [`bHidden=${KismetBoolean.toKismet(this.bHidden)}`]
                : []
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

    public addLink (linkId: string, index?: number, hidden?: boolean): this {
        this.links ??= []

        if (hidden != undefined) {
            this.bHidden = hidden
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
        this.bHidden = hidden

        return this
    }

    public prefix (index?: number): string {
        return `${this.typeName}(${index ?? this.connectionIndex})`
    }

    public get value (): string {
        return this.format()
    }

    public toString (index?: number): string {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return KismetItemFormatter.variable(this.prefix(index), this.value)!
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

    constructor (input: string, type: KismetConnectionType, index?: number) {
        super({
            input,
            index,
            type: Constants.ConnectionType.VARIABLE,
            extends: true,
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

        const expectedClass = this.expectedType.split("'")[1].split('.')[1]

        if (!this.bAllowAnyType && linkId.split("'")[0] !== expectedClass) {
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

    public override toString (index?: number): string {
        return super.toString(index)
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
        const kismet = super.toString(index)

        return kismet
    }
}

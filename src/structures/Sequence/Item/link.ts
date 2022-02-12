import {
    boolToKismet,
    parseVar,
    t,
    Constants
} from '../../../shared/index.js'

import type {
    BaseKismetConnectionOptions,
    BaseKismetVariableLink,
    KismetConnectionLink,
    KismetConnectionType,
    KismetVariableLink,
    KismetInputLink,
    KismetOutputLink
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

    public setHidden (hidden: boolean): this {
        this.bHidden = hidden

        return this
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

    public toKismet (index?: number): string {
        return parseVar(`${this.typeName}(${index ?? this.connectionIndex})`, `(${this.formatted})`)
    }
}

// TODO: fix types
export class KismetConnection extends BaseKismetConnection implements BaseKismetVariableLink {
    public OverrideDelta: number;
    public bClampedMin: boolean;
    public bClampedMax: boolean;
    public bMoving: boolean;
    public bHidden: boolean;

    constructor (input: string, type: KismetConnectionType, index?: number) {
        super({
            input: Constants.DefaultConnectionName.IN,
            type,
            index
        })

        const properties = this.getPropsFromInput(input)

        const { 
            LinkDesc, 
            OverrideDelta, 
            bClampedMin, 
            bClampedMax, 
            bMoving, 
            bHidden 
        } = properties

        this.name = (<string>t(LinkDesc)).replaceAll('"', '')

        this.OverrideDelta = t(OverrideDelta) ?? 0;
        this.bClampedMin = t(bClampedMin) ?? false;
        this.bClampedMax = t(bClampedMax) ?? false;

        this.bMoving = t(bMoving) ?? false;
        this.bHidden = t(bHidden) ?? false;

        if (this.isVariableLink()) {
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

        if (this.isLinkType()) {
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

            this.setActivateDelay = (duration: number): KismetConnectionLink => {
                t<KismetConnectionLink>(this).ActivateDelay = duration;

                return t<KismetConnectionLink>(this)
            }

            if (this.isInputLink()) {
                this.QueuedActivations = t(properties.QueuedActivations) ?? 0;
            } else if (this.isOutputLink()) {
                const { bIsActivated, PIEActivationTime } = properties
                
                this.bIsActivated = t(bIsActivated) ?? false;
                this.PIEActivationTime = t(PIEActivationTime) ?? 0.0;
            }
        }
    }

    private getPropsFromInput (input: string): Record<string, string | number | boolean> {
        return input.slice(1, -1).split(',').map(prop => {
            return {
                name: prop.substring(0, prop.indexOf('=')),
                value: prop.substring(prop.indexOf('=') + 1)
            }
        }).reduce((z, a) => ({...z, [a.name]: a.value}), {})
    }

    private isLinkType (): this is KismetConnectionLink {
        return this.isInputLink() || this.isOutputLink()
    }

    public isVariableLink (): this is KismetVariableLink {
        return this.type === 'variable'
    }

    public isInputLink (): this is KismetInputLink {
        return this.type === 'input'
    }

    public isOutputLink (): this is KismetOutputLink {
        return this.type === 'output'
    }

    public override setHidden (hidden: boolean): this {
        this.bHidden = hidden

        return this
    }

    public override toKismet(index?: number): string {
        return super.toKismet(index)
    }
}
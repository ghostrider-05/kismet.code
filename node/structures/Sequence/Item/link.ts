import {
    parseVar,
    t
} from '../../../shared/index.js'

import type {
    BaseKismetVariableLink,
    KismetConnectionLink,
    KismetConnectionType,
    KismetVariableLink,
    KismetInputLink,
    KismetOutputLink
} from '../../../types/index.js'

export class KismetConnection implements BaseKismetVariableLink {
    private type: KismetConnectionType;

    name: string;
    OverrideDelta: number;
    bClampedMin: boolean;
    bClampedMax: boolean;
    bMoving: boolean;
    bHidden: boolean;

    constructor (input: string, type: KismetConnectionType) {
        this.type = type

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

        if (this.isOutputLink() || this.isVariableLink()) {
            this.links = [];
        }

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

    private formatConnection (): string {
        const base = [
            `OverrideDelta=${this.OverrideDelta}`
        ]
        
        if (this.isVariableLink()) {
            return base.concat([
                `DrawX=${this.DrawX}`,
            ]).join(',')

        } else if (this.isLinkType()) {
            return base.concat([
                `DrawY=${this.DrawY}`
            ].concat(this.isOutputLink() && this.links.length > 0 ? [
                `Links=(${this.links.join(',')})`
            ] : [])).join(',')
            
        } else return '' // Types
    }

    private getCollectionName () : string {
        return (this.type[0] + this.type.slice(1)) + 'Links'
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

    public addLink (linkId: string, index?: number): this {
        if (this.isOutputLink() || this.isVariableLink()) {
            this.links.push(`(LinkedOp=${linkId}${typeof index === 'number' ? `,InputLinkIdx=${index}` : ''})`)
        }

        return this
    }

    public toggleHidden (): this {
        this.bHidden = !this.bHidden

        return this
    }

    public toKismet (index: number): string {
        return parseVar(`${this.getCollectionName()}(${index})`, `(${this.formatConnection()})`)
    }
}
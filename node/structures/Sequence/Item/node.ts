import { BaseSequenceItem } from './base.js'
import { SequenceVariable } from '../Variable.js'

import {
    addVariable,
    boolToKismet
} from '../../../shared/index.js'

import type {   
    BaseKismetItemOptions,
    SequenceItemTypeName
} from '../../../types/index.js'

export class SequenceNode extends BaseSequenceItem {
    public hasBreakpoint: boolean;
    private variables: { name: string, value: string }[]

    constructor (options: BaseKismetItemOptions & { type?: SequenceItemTypeName}) {
        super(options)

        this.hasBreakpoint = false
        this.variables = []
    }

    public setBreakPoint (): this {
        this.hasBreakpoint = true

        return this
    }

    public removeBreakpoint (): this {
        this.hasBreakpoint = false

        return this
    }

    public setVariable (variableName: string, value: SequenceVariable | string | number, hidden?: boolean): this {
        const connection = this.getConnection('variable', variableName)

        if (connection && (typeof value !== 'string' && typeof value !== 'number')) {
            connection.addLink(value.linkId, this.connections?.variable.indexOf(connection), hidden)
        } else {
            this.variables.push({
                name: variableName,
                value: value.toString()
            })
        }

        return this
    }

    public override toKismet (): string {
        const kismet = super.toKismet()

        if (this.hasBreakpoint) this.setVariable('bIsBreakpointSet', boolToKismet(true))

        const properties: [string, string][] = this.variables.map(v => [v.name, v.value])

        return addVariable(kismet, properties)
    }
}
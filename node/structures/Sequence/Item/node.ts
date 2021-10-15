import { BaseSequenceItem, KismetItemConfigOptions } from './base.js'
import { SequenceVariable } from "../Variable";

import {
    addVariable,
    boolToKismet
} from '../../../shared/index.js'

export class SequenceNode extends BaseSequenceItem {
    public hasBreakpoint: boolean;
    private variables: { name: string, value: string }[]

    constructor (options: KismetItemConfigOptions) {
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

    public setVariable (variableName: string, item: SequenceVariable | string): this {
        const connection = this.getConnection('variable', variableName)

        if (connection && typeof item !== 'string') {
            connection.addLink(item.linkId, this.connections.variable.indexOf(connection))
        } else {
            this.variables.push({
                name: variableName,
                value: String(item)
            })
        }

        return this
    }

    public override toKismet (): string {
        const kismet = super.toKismet()

        const properties = this.variables.map(v => [v.name, v.value])
            .concat(this.hasBreakpoint ? [
                'bIsBreakpointSet', 
                boolToKismet(true)
            ] : []) as [string, string][]

        return addVariable(kismet, properties)
    }
}
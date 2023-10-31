import { BaseSequenceItem } from './base.js'
import { KismetBoolean } from '../util/index.js'

import type { SequenceVariable, KismetVariableValue, SequenceItemTypeName } from '../structures/index.js'


import type { BaseKismetItemOptions } from './options.js'
import { VariableConnection } from './link.js'

export class SequenceNode extends BaseSequenceItem {
    public hasBreakpoint = false
    private variables: { name: string; value: string }[] = []

    constructor (
        options: BaseKismetItemOptions & { type?: SequenceItemTypeName }
    ) {
        super(options)
    }

    public setBreakpoint (enabled: boolean): this {
        this.hasBreakpoint = enabled

        this.setVariable('bIsBreakpointSet', KismetBoolean.toKismet(enabled))

        return this
    }

    public setVariable (
        variableName: string,
        value: SequenceVariable | string | number,
        hidden?: boolean,
        expose?: boolean,
    ): this {
        const connection = this.connections.get(
            'variable',
            variableName
        )

        if (
            typeof value !== 'string' &&
            typeof value !== 'number'
        ) {
            if (!connection) {
                if (expose) {
                    const vConn = new VariableConnection(
                        `(ExpectedType=${value.ClassData.ClassType},LinkDesc="${variableName}",PropertyName="${variableName}")`,
                        'variable',
                        this.connections.sockets.variable.length,
                        true,
                    )

                    this.connections.sockets.variable.push(vConn)
                    
                    vConn.addLink(
                        value.linkId,
                        vConn.index,
                        hidden,
                    )
                    
                } else {
                    console.warn('Unable to find variable connection, nothing is added')
                }
            } else {
                connection.addLink(
                    value.linkId,
                    connection.index,
                    hidden
                )
            }
        } else if (!value.toString().includes('Begin')) {
            if (!this.variables.some(n => n.name === variableName)) {
                this.variables.push({
                    name: variableName,
                    value: value.toString(),
                })
            } else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.variables.find(n => n.name === variableName)!.value =
                    value as string
            }
        }

        return this
    }

    public override toJSON (): Record<string, KismetVariableValue> {
        const variables = this.variables.reduce(
            (prev, curr) => ({
                ...prev,
                [curr.name]: curr.value,
            }),
            {}
        )

        return {
            ...variables,
            ...super.toJSON(),
        }
    }

    public override toString (): string {
        this.setProperty(...this.variables)

        return super.toString()
    }
}

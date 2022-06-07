import { BaseSequenceItem } from './base.js'
import { VariableConnection } from './link.js'
import { SequenceVariable } from '../Variable.js'

import { addVariable, boolToKismet } from '../../../shared/index.js'

import type {
    BaseKismetItemOptions,
    KismetVariablesType,
    SequenceItemTypeName,
} from '../../../types/index.js'

export class SequenceNode extends BaseSequenceItem {
    public hasBreakpoint = false
    private variables: { name: string; value: string }[] = []

    constructor (
        options: BaseKismetItemOptions & { type?: SequenceItemTypeName }
    ) {
        super(options)
    }

    public setBreakPoint (enabled: boolean): this {
        this.hasBreakpoint = enabled

        this.setVariable('bIsBreakpointSet', boolToKismet(enabled))

        return this
    }

    public setVariable (
        variableName: string,
        value: SequenceVariable | string | number,
        hidden?: boolean
    ): this {
        const connection = this.getConnection(
            'variable',
            variableName
        ) as VariableConnection

        if (
            connection &&
            typeof value !== 'string' &&
            typeof value !== 'number'
        ) {
            connection.addLink(
                value.linkId,
                this.connections?.variable.indexOf(connection),
                hidden
            )
        } else {
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

    public override toJSON (): Record<string, KismetVariablesType> {
        const breakpoint = this.hasBreakpoint
            ? {
                  bIsBreakpointSet: this.hasBreakpoint,
              }
            : {}

        const variables = this.variables.reduce(
            (prev, curr) => ({
                ...prev,
                [curr.name]: curr.value,
            }),
            {}
        )

        return {
            ...breakpoint,
            ...variables,
            ...super.toJSON(),
        }
    }

    public override toString (): string {
        const node = super.toString()

        const properties: [string, string][] = this.variables.map(v => [
            v.name,
            v.value,
        ])

        return addVariable(node, properties)
    }

    /**
     * @deprecated
     */
    public override toKismet (): string {
        return this.toString()
    }
}

import { ItemConnection, VariableConnection } from '../structures/index.js'

export type KismetVariableLinkConnection = string

export type KismetConnectionType = 'input' | 'variable' | 'output'

export type KismetConnection = ItemConnection | VariableConnection

// Cannot convert to interface
export type KismetConnections = {
    input: ItemConnection[]
    output: ItemConnection[]
    variable: VariableConnection[]
}

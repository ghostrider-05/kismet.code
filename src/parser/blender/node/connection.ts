import { Constants, KismetError } from '../../../shared/index.js'

import {
    UnrealJsonReadFileNode,
    KismetConnectionType
} from '../../../types/index.js'
import { linkIcon } from './icon.js'
import { variableBlenderType } from './variable.js'

const { ConnectionType, NodeType } = Constants

const defaultKeyValue = (key: string) => {
    const name =
        key === Constants.ConnectionType.INPUT
            ? Constants.DefaultConnectionName.IN
            : Constants.DefaultConnectionName.OUT

    return [{ name: `"${name}"` }]
}

const getKeyValue = (key: string, type: string, links?: { name: string }[]) => {
    if (
        type === NodeType.VARIABLES ||
        (type === NodeType.EVENTS && key === ConnectionType.INPUT)
    )
        return []
    if ((links?.length ?? 0) > 0) return undefined

    if (type === NodeType.EVENTS && key === ConnectionType.VARIABLE)
        return [
            {
                name: `"Instigator"`
            }
        ]

    if (
        (<string[]>[NodeType.ACTIONS, NodeType.CONDITIONS]).includes(type) &&
        key === ConnectionType.VARIABLE
    )
        return [
            {
                name: `"Target"`
            }
        ]

    return defaultKeyValue(key)
}

const getConnections = (node: UnrealJsonReadFileNode) => {
    return Object.keys(node.links)
        .map(key => {
            return {
                [key]:
                    getKeyValue(
                        key,
                        node.type,
                        node.links[key as KismetConnectionType]
                    ) ?? node.links[key as KismetConnectionType]
            }
        })
        .reduce(
            (prev, curr) => ({
                ...prev,
                ...curr
            }),
            {}
        ) as UnrealJsonReadFileNode['links']
}

const nodeSocketName = (name: string) =>
    `${name
        .trim()
        .replaceAll(/"| /g, '')
        .replaceAll(/\(|\)|-/g, '_')
        .replaceAll(/</g, '0')
        .replaceAll(/=/g, '1')
        .replaceAll(/>/g, '2')
        .replaceAll(/!/g, '3')}Socket`

export const formatConnections = (node: UnrealJsonReadFileNode) => {
    const connections = getConnections(node)

    if (
        Object.keys(connections).every(key => {
            return connections[key as KismetConnectionType].length === 0
        })
    ) {
        return `    print('No connections on ${node.Class}')`
    }

    return Object.keys(connections)
        .map(key => {
            let prefix = ''

            switch (key) {
                case Constants.ConnectionType.INPUT:
                case Constants.ConnectionType.VARIABLE:
                    prefix = 'self.inputs'
                    break
                case Constants.ConnectionType.OUTPUT:
                    prefix = 'self.outputs'
                    break
                default:
                    new KismetError('INVALID_TYPE')
            }

            return connections[key as KismetConnectionType]
                .map(node => {
                    const finalPrefix =
                        node.name === `"Instigator"` ? 'self.outputs' : prefix
                    const socketName = nodeSocketName(node.name)

                    return `        ${socketName} = ${finalPrefix}.new('${
                        variableBlenderType(node.expectedType).socket
                    }', ${
                        node.name
                    })\n        ${socketName}.display_shape = '${linkIcon(
                        key
                    )}'\n        ${socketName}.link_limit = 250\n`
                })
                .join('\n')
        })
        .join('\n\n')
}

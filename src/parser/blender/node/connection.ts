import { Constants } from "../../../shared/index.js"
import { UnrealJsonReadFileNode, KismetConnectionType } from "../../../types/index.js"

const { ConnectionType, NodeType } = Constants

const defaultKeyValue = (key: string) => {
    const name = key === Constants.ConnectionType.INPUT 
        ? Constants.DefaultConnectionName.IN 
        : Constants.DefaultConnectionName.OUT

    return [{ name: `"${name}"` }]
}

const getKeyValue = (key: string, type: string, links?: { name: string }[]) => {
    if (type === NodeType.VARIABLES || (type === NodeType.EVENTS && key === ConnectionType.INPUT)) return []
    if ((links?.length ?? 0) > 0) return undefined

    if (type === NodeType.EVENTS && key === ConnectionType.VARIABLE) return [
        { 
            name: `"Instigator"` 
        }
    ]

    if ((<string[]>[NodeType.ACTIONS, NodeType.CONDITIONS]).includes(type) && key === ConnectionType.VARIABLE) return [
        {
            name: `"Target"`
        }
    ]

    return defaultKeyValue(key)
}

export const getConnections = (node: UnrealJsonReadFileNode) => {
    return Object.keys(node.links).map(key => {
        return {
            [key]: getKeyValue(key, node.type, node.links[key as KismetConnectionType])
                ?? node.links[key as KismetConnectionType]
        }
    }).reduce((prev, curr) => ({
        ...prev,
        ...curr
    }), {}) as UnrealJsonReadFileNode['links']
}

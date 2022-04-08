import { getConnections } from "./node/index.js"

import { Constants, KismetError } from "../../shared/index.js"
import { UnrealJsonReadFileNode, KismetConnectionType } from "../../types/index.js"

const variableBlenderType = (type?: string) => {
    let socket = '', Class = ''

    switch (type) {
        case "Class'Engine.SeqVar_Float'":
        case "class'SeqVar_Float'":
        case 'float':
            socket = 'NodeSocketFloat'
            Class = 'FloatProperty'
            break
        case "class'SeqVar_Int'":
        case "Class'Engine.SeqVar_Int'":
        case 'int':
            socket = 'NodeSocketInt'
            Class = 'IntProperty'
            break
        case "Class'Engine.SeqVar_Bool'":
        case "class'SeqVar_Bool'":
        case 'bool':
            socket = 'NodeSocketBool'
            Class = 'BoolProperty'
            break
        case "Class'Engine.SeqVar_Vector'":
        case "class'SeqVar_Vector'":
        case 'Vector':
            socket = 'NodeSocketVector'
            Class = 'StringProperty'
            break
        default:
            socket = 'NodeSocketString'
            Class = 'StringProperty'
    }

    return {
        socket,
        Class
    }
}

export const formatConnections = (node: UnrealJsonReadFileNode) => {
    const connections = getConnections(node)

    if (Object.keys(connections).every(key => {
        return connections[key as KismetConnectionType].length === 0
    })) {
        return `    print('No connections on ${node.Class}')`
    }

    return Object.keys(connections).map(key => {
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
    
        return connections[key as KismetConnectionType].map(node => {
            const finalPrefix = node.name === `"Instigator"` ? 'self.outputs' : prefix

            return `        ${finalPrefix}.new('${variableBlenderType(node.expectedType).socket}', ${node.name})`
        }).join('\n')
    }).join('\n\n')
}

export const formatVariables = (node: UnrealJsonReadFileNode) => {
    const staticVariables = node.variables.map(variable => {
        return `    ${variable.name}: bpy.props.${variableBlenderType(variable.type).Class}(name="${variable.name}")`
    }).join('\n')

    const sidebar = node.variables.map(variable => {
        return `        layout.prop(self, "${variable.name}")`
    }).join('\n')

    return {
        staticVariables,
        sidebar: node.variables.length > 0 ? sidebar : `        print('Nothing here...')`
    }
}

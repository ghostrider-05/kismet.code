import {
    defaultNodeVariables,
    getIcon,
    formatVariables,
    formatVariableNames,
    formatConnections,
    formatVariableSockets
} from '../node/index.js'

import { Constants } from '../../../shared/index.js'

import type { 
    UnrealJsonReadFile,
    UnrealJsonReadFileNode 
} from '../../../types/index.js'

const displayName = (node: UnrealJsonReadFileNode) => {
    return node.displayName ?? `"${node.Class}"`
}

export const classTemplate = (node: UnrealJsonReadFileNode, classes: Partial<UnrealJsonReadFile>[]) => `
class ${node.Class}(Node, KismetNodeTreeNode):
    '''${node.Package}/${node.Class}'''
    bl_idname = '${node.Class}'
    bl_label = ${displayName(node)}
    bl_icon = '${getIcon(node.type)}'

    ObjInstanceVersion = ${Constants.ObjInstanceVersions.get(node.Class) ?? 1}
    ObjectArchetype = ${node.archetype}
    KismetType = '${node.type}'
${formatVariableNames(node, classes)}

${defaultNodeVariables(node.type)}

${formatVariables(node, classes)}

    def init(self, context):
${formatConnections(node, classes)}
    def copy(self, node):
        print("Copying from node ", node)

    def free(self):
        print("Removing node ", self, ", Goodbye!")

${formatVariableSockets(node)}
    
    # Optional: custom label
    # Explicit user label overrides this, but here we can define a label dynamically
    def draw_label(self):
        return ${displayName(node)}
`

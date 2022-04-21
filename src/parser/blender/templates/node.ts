import {
    defaultNodeVariables,
    getIcon,
    formatVariables,
    formatConnections,
    formatVariableSockets
} from '../node/index.js'

import type { UnrealJsonReadFileNode } from '../../../types/index.js'
import { Constants } from '../../../shared/index.js'

const displayName = (node: UnrealJsonReadFileNode) => {
    return node.displayName ?? `"${node.Class}"`
}

export const classTemplate = (node: UnrealJsonReadFileNode) => `
class ${node.Class}(Node, KismetNodeTreeNode):
    '''${node.Package}/${node.Class}'''
    bl_idname = '${node.Class}'
    bl_label = ${displayName(node)}
    bl_icon = '${getIcon(node.type)}'

    ObjInstanceVersion = ${Constants.ObjInstanceVersions.get(node.Class) ?? 1}
    ObjectArchetype = ${node.archetype}
    KismetType = '${node.type}'

${defaultNodeVariables(node.type)}

${formatVariables(node)}

    def init(self, context):
${formatConnections(node)}
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

import { formatConnections, formatVariables } from "../format.js"
import { getIcon } from "../node/index.js"

import type { UnrealJsonReadFileNode } from "../../../types/index.js"
import { Constants } from "../../../shared/index.js"

export const classTemplate = (node: UnrealJsonReadFileNode) => `
# Derived from the Node base type.
class ${node.Class}(Node, KismetNodeTreeNode):
    # === Basics ===
    # Description string
    '''${node.Package}/${node.Class}'''
    # Optional identifier string. If not explicitly defined, the python class name is used.
    bl_idname = '${node.Class}'
    # Label for nice name display
    bl_label = ${node.displayName ?? `"${node.Class}"`}
    # Icon identifier
    bl_icon = '${getIcon(node.type)}'

    ObjInstanceVersion = ${Constants.ObjInstanceVersions.get(node.Class) ?? 1}
    ObjectArchetype = ${node.archetype}

${formatVariables(node).staticVariables}

    # === Optional Functions ===
    # Initialization function, called when a new node is created.
    # This is the most common place to create the sockets for a node, as shown below.
    # NOTE: this is not the same as the standard __init__ function in Python, which is
    #       a purely internal Python method and unknown to the node system!
    def init(self, context):
${formatConnections(node)}
    # Copy function to initialize a copied node from an existing one.
    def copy(self, node):
        print("Copying from node ", node)
    
    # Free function to clean up on removal.
    def free(self):
        print("Removing node ", self, ", Goodbye!")
    
    # Additional buttons displayed on the node.
    #def draw_buttons(self, context, layout):
    #    layout.label(text="Node Settings:")
    #    layout.prop(self, "get_property")
    
    # Detail buttons in the sidebar.
    # If this function is not defined, the draw_buttons function is used instead
    def draw_buttons_ext(self, context, layout):
${formatVariables(node).sidebar}
    
    # Optional: custom label
    # Explicit user label overrides this, but here we can define a label dynamically
    def draw_label(self):
        return ${node.displayName ?? `"${node.Class}"`}
`
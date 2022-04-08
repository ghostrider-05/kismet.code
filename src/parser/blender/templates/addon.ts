export const baseTemplate = `
import bpy
from bpy.types import NodeTree, Node, NodeSocket
import paperclip

# Implementation of custom nodes from Python

# Derived from the NodeTree base type, similar to Menu, Operator, Panel, etc.
class KismetNodeTree(NodeTree):
    # Description string
    '''A custom node tree type that will show up in the editor type list'''
    # Optional identifier string. If not explicitly defined, the python class name is used.
    bl_idname = 'KismetTreeType'
    # Label for nice name display
    bl_label = "Kismet Sequence editor"
    # Icon identifier
    bl_icon = 'NODETREE'

    name = "Kismet Sequence"


# Mix-in class for all custom nodes in this tree type.
# Defines a poll function to enable instantiation.
class KismetNodeTreeNode:
    @classmethod
    def poll(cls, ntree):
        return ntree.bl_idname == 'KismetTreeType'
`
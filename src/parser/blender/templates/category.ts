import { nodeCategories, nodeCategoryClasses } from '../category.js'

export const registerTemplate = (categories: Record<string, string[]>) => `
### Node Categories ###
# Node categories are a python system for automatically
# extending the Add menu, toolbar panels and search operator.
# For more examples see release/scripts/startup/nodeitems_builtins.py

import nodeitems_utils
from nodeitems_utils import NodeCategory, NodeItem

# our own base class with an appropriate poll function,
# so the categories only show up in our own tree type


class KismetNodeCategory(NodeCategory):
    @classmethod
    def poll(cls, context):
        return context.space_data.tree_type == 'KismetTreeType'

node_categories = [
${nodeCategories(categories)}
]

classes = (
    KismetNodeTree,
    NODE_OT_export_kismet,
${nodeCategoryClasses(categories)}
)

def register():
    from bpy.utils import register_class
    for cls in classes:
        register_class(cls)
    try:
        nodeitems_utils.register_node_categories('KISMET_NODES', node_categories)
        bpy.types.NODE_HT_header.append(draw_export_button)
    except:
        nodeitems_utils.unregister_node_categories('KISMET_NODES')
        nodeitems_utils.register_node_categories('KISMET_NODES', node_categories)

def unregister():
    nodeitems_utils.unregister_node_categories('KISMET_NODES')
    bpy.types.NODE_HT_header.remove(draw_export_button)

    from bpy.utils import unregister_class
    for cls in reversed(classes):
        unregister_class(cls)


if __name__ == "__main__":
    register()
`

export const operatorTemplate = `
class NODE_OT_export_kismet(bpy.types.Operator):
    bl_idname = "udk.export_active_kismet"
    bl_label = "Copy kismet"
    bl_description = "Copy this sequence from Blender to be used in UDK"

    @classmethod
    def poll(cls, context):
        return context.space_data.tree_type == 'KismetTreeType'    

    def execute (self, context):
        node_tree = context.space_data.edit_tree
        sequence_name = 'Main_Sequence' if node_tree.name == 'NodeTree' else node_tree.name
        sequence_text = ''

        indexes = []

        for node in node_tree.nodes:
            has_node = False
            node_index = 0
            node_text = ''

            for index in indexes:
                if not has_node and index[0] == node.ObjectArchetype:
                    indexes[indexes.index(index)] = [node.ObjectArchetype, index[1] + 1]
                    
                    node_index = index[1]
                    has_node = True
            if not has_node:
                indexes.append([node.ObjectArchetype, 1])

            node_variables = [
                f"ObjInstanceVersion={node.ObjInstanceVersion}",
                f"ParentSequence=Sequence'{sequence_name}'",
                f"ObjPosX={int(node.location[0])}",
                f"ObjPosY={int(node.location[1])}",
                f'Name="{node.bl_idname}_{node_index}"',
                f"ObjectArchetype={node.ObjectArchetype}"
            ]

            node_text += f"Begin Object Class={node.bl_idname} Name={node.bl_idname}_{node_index}\\n"

            for node_variable in node_variables:
                node_text += f"   {node_variable}\\n"

            node_text += "End Object\\n"

            sequence_text += node_text

        paperclip.copy(sequence_text.rstrip())

        self.report({ 'INFO' }, 'Copied kismet nodes')

        return { 'FINISHED' }

def draw_export_button(self, context):
    self.layout.operator(NODE_OT_export_kismet.bl_idname)
`
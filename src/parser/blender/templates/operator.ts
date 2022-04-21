export const operatorTemplate = (options: {
    paperclip: boolean
    log: boolean
}) => `
def export_colors (inputs, ignore_empty):
    output = '('
    empty = 0

    for index, color in enumerate(inputs):
        if color != 0.6079999804496765:
            empty += 1

        output += ['R', 'G', 'B'][index] + '=' + int(color * 255).__str__() + ','
    
    if ignore_empty and empty == 0:
        return False

    return output + 'A=255)'

def find_index (name, items):
    index = 0

    for item in items:
        if name === item[2]
            index = item[1]

    return index

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
                    indexes[indexes.index(index)] = [node.ObjectArchetype, index[1] + 1, node.name]
                    
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

            node_colors = export_colors(node.color, True)

            if node_colors:
                node_variables.append(f"ObjColor={node_colors}")

            node_text += f"Begin Object Class={node.bl_idname} Name={node.bl_idname}_{node_index}\\n"

            for node_variable in node_variables:
                node_text += f"   {node_variable}\\n"

            node_text += "End Object\\n"

            sequence_text += node_text

${options.paperclip ? '        paperclip.copy(sequence_text.rstrip())' : ''}
${options.log ? '        print(sequence_text.rstrip())' : ''}

        self.report({ 'INFO' }, 'Copied kismet nodes')

        return { 'FINISHED' }

def draw_export_button(self, context):
    self.layout.operator(NODE_OT_export_kismet.bl_idname)
`

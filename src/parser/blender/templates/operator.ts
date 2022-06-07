import { linkIcon } from '../node/index.js'

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
        if name == item[2]:
            index = item[1]

    return index

def find_objectnum_from_scene (scene, obj_name):
    storage = scene.numberStorage

    if storage is None:
        return None

    for obj in storage[:]:
        if obj.objName  == obj_name:
            return obj.number

    return None

def generate_indexes (nodes):
    indexes = []

    for node in nodes:
        has_node = False

        for index in indexes:
            if not has_node and index[0] == node.ObjectArchetype:
                indexes.append([node.ObjectArchetype, index[1] + 1, node.name])
                has_node = True

        if not has_node:
            indexes.append([node.ObjectArchetype, 0, node.name])

    return indexes

def format_list (items):
    output = ''

    for item in items:
        output += item

        if items.index(item) < (len(items) - 1): 
            output += ','
    
    return output

def validate_sockets (link):
    from_icon = link.from_socket.display_shape
    to_icon = link.to_socket.display_shape

    is_var_link = from_icon == '${linkIcon(
        'variables'
    )}' or to_icon == '${linkIcon('variables')}'

    if is_var_link:
        return from_icon == '${linkIcon(
            'variables'
        )}' and to_icon == '${linkIcon('variables')}'
    else:
        return True

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

        if len(node_tree.nodes) == 0:
            self.report({ 'ERROR' }, 'No kismet nodes found in this sequence...')
            return { 'CANCELLED' }

        indexes = generate_indexes(node_tree.nodes)

        default_keys = [
            'breakpoint',
            'ObjInstanceVersion',
            'ObjColor'
        ]

        default_key_matches = [
            'Enum',
            'Comment',
            'bl_'
        ]

        if len(node_tree.nodes) == 0:
            self.report({ 'INFO' }, 'No kismet nodes to copy in this sequence...')
            return

        for node in node_tree.nodes:
            node_index = find_index(node.name, indexes)
            node_text = ''

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

            if '_SequenceItemVariableNames' in node and node._SequenceItemVariableNames is not None:
                for _item_name in node._SequenceItemVariableNames:
                    node_variables.append(f"{_item_name}={node[_item_name]}")

            # TODO: check when variables required quotes, StringProperty?
            if node.ObjComment != '':
                node_variables.append(f"ObjComment=\\"{node.ObjComment}\\"")
            
            if node.bOutputObjCommentToScreen:
                node_variables.append(f"bOutputObjCommentToScreen={node.bOutputObjCommentToScreen}")

            if node.bSuppressAutoComment is not False:
                node_variables.append(f"bSuppressAutoComment={node.bSuppressAutoComment}")

            if node.breakpoint:
                node_variables.append(f"bIsBreakpointSet=True")

            for connection_index, connection in enumerate(node.outputs):
                connected_items = []

                # Check if connection is not variable
                if len(connection.links) > 0 and connection.display_shape != 'SQUARE':
                    for link in connection.links:
                        to_class = link.to_node.bl_idname
                        to_index = find_index(link.to_node.name, indexes)

                        if not validate_sockets(link):
                            self.report({ 'WARNING' }, f'Invalid variable connection made between {link.from_node} and {link.to_node}')

                        link_text = f"(LinkedOp={to_class}'{to_class}_{to_index}'"
                        socket_index = link.to_node.inputs[:].index(link.to_socket)

                        if socket_index > 0:
                            link_text += f",InputLinkIdx={socket_index}"
                        link_text += ')'

                        print(link_text)
                        connected_items.append(link_text)
                
                    linked_items_text = ''
                    if len(connected_items) > 0:
                        linked_items_text += f"Links=({format_list(connected_items)}),"
                    
                    node_variables.append(
                        f"OutputLinks({connection_index})=({linked_items_text}DrawY=0,OverrideDelta=0)"
                    )
            
            if len(node.inputs) > 0:
                variable_inputs = [link for link in node.inputs if link.display_shape == 'SQUARE']
                normal_inputs = [link for link in node.inputs if link.display_shape != 'SQUARE']

                if len(normal_inputs) > 0:
                    for input in normal_inputs:
                        for link in input.links:
                            if not validate_sockets(link):
                                self.report({ 'WARNING' }, f'Invalid variable connection made between {link.from_node} and {link.to_node}')

                        node_variables.append(
                            f"InputLinks({normal_inputs.index(input)})=(DrawY=0,OverrideDelta=0)"
                        )

                if len(variable_inputs) > 0:
                    for variable in variable_inputs:
                        linked_variables = []
                        variable_index = variable_inputs.index(variable)

                        for link in variable.links:
                            if not validate_sockets(link):
                                self.report({ 'WARNING' }, f'Invalid variable connection made between {link.from_node} and {link.to_node}')

                            var_class = link.from_node.bl_idname
                            var_index = find_index(link.from_node.name, indexes)

                            linked_variables.append(
                                f"{var_class}'{var_class}_{var_index}'"
                            )
                        
                        linked_variables_text = ''
                        if len(linked_variables) > 0:
                            linked_variables_text += f"LinkedVariables=({format_list(linked_variables)}),"

                        node_variables.append(
                            f"VariableLinks({variable_index})=({linked_variables_text}DrawX=0,OverrideDelta=0)"
                        )

            unknown_keys = []
            for key in node.keys():
                if key in default_keys:
                    continue

                for match in default_key_matches:
                    if match in key:
                        continue

                unknown_keys.append(key)

                node_variables.append(f"{key}={node[key]}")
            print(unknown_keys)

            node_text += f"Begin Object Class={node.bl_idname} Name={node.bl_idname}_{node_index}\\n"

            for node_variable in node_variables:
                node_text += f"   {node_variable}\\n"

            node_text += "End Object\\n"

            sequence_text += node_text

${options.paperclip ? '        paperclip.copy(sequence_text.rstrip())' : ''}
${options.log ? '        print(sequence_text.rstrip())' : ''}

        self.report({ 'INFO' }, ${
            options.paperclip
                ? 'Copied kismet nodes'
                : 'Logged kismet nodes to console'
        })

        return { 'FINISHED' }

def draw_export_button(self, context):
    if context.space_data.tree_type == 'KismetTreeType':
        self.layout.operator(NODE_OT_export_kismet.bl_idname)
`

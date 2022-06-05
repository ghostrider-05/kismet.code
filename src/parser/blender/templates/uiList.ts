const layout = (obj: string, key: string) => `
        row = layout.row()
        row.template_list("ARRAY_UL_kismet", "", ${obj}, "${key}", ${obj}, "${key}_index")

        col = row.column(align=True)

        col.operator("kismet_uilist.add", icon='ADD', text="")
        col.operator("kismet_uilist.remove", icon='REMOVE', text="")
`

const classes = `
class ARRAY_UL_kismet(bpy.types.UIList):
    def draw_item(self, context, layout, data, item, icon, active_data, active_propname):
        ob = data
        slot = item
        
        if self.layout_type in {'DEFAULT', 'COMPACT'}:
            if ma:
                layout.prop(item, "name", text="", emboss=False, icon_value=icon)
            else:
                layout.label(text="", translate=False, icon_value=icon)
        elif self.layout_type in {'GRID'}:
            layout.alignment = 'CENTER'
            layout.label(text="", icon_value=icon)
            
class KismetArrayOperator():
    node_id: bpy.props.StringProperty(name='node_id')
    name: bpy.props.StringProperty(name='name')

class AddKismetArrayOperator(bpy.types.Operator):
    bl_idname = "kismet_uilist.add"
    bl_label = "Add a new item"
    
    def execute(self, context):
        print(dir(context))
        
        return {'FINISHED'}
    
class RemoveKismetArrayOperator(bpy.types.Operator):
    bl_idname = "kismet_uilist.remove"
    bl_label = "Remove an item"
    
    def execute(self, context):
        print(dir(context))
        
        return {'FINISHED'}
`

export const ArrayUIList = {
    classes,
    layout
}
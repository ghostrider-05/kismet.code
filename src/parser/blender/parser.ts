import { groupByProperty } from "../../shared/index.js";
import { UnrealJsonReadFileNode } from "../../types/index.js";
import { 
    baseTemplate, 
    classTemplate,  
    operatorTemplate,
    registerTemplate 
} from "./templates/index.js";

export class BlenderAddonGenerator {
    static create (nodes: UnrealJsonReadFileNode[]) {
        console.log('Blender nodes: ' + nodes.length)
        const categories = groupByProperty(nodes, 'type').map(items => {
            return {
                [items[0].type]: items.map(item => item.Class)
            }
        }).reduce((prev, curr) => ({ ...prev, ...curr }), {})

        return [
            baseTemplate,
            ...nodes.map(classTemplate),
            operatorTemplate,
            registerTemplate(categories)
        ].join('\n\n')
    }
}

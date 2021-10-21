import { SequenceNode } from './Item/index.js'

import type { 
    BaseKismetItemOptions,
    KismetActionRequiredOptions 
} from '../../types/index.js'

export class SequenceAction extends SequenceNode {

    constructor (options: KismetActionRequiredOptions & BaseKismetItemOptions) {
        super(options)
    } 

    public addConnection (item: SequenceAction, outputName: string, inputName: string): this {
        const connection = this.getConnection('output', outputName);
        const itemConnection = item.getConnection('input', inputName);
        
        if (connection && itemConnection) {
            connection.addLink(item.linkId, item.connections.input.indexOf(itemConnection))
        }

        return this
    }

    public setTargets (objects: string[]): this {
        objects.forEach((object, i) => {
            this.setVariable(`Targets(${i})`, object)
        })

        return this
    }
}
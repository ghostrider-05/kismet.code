import { KismetItemConfigOptions, SequenceNode } from './Item.js'

import type { KismetActionRequiredOptions } from '../../types/index.js'

export class SequenceAction extends SequenceNode {

    constructor (options: KismetActionRequiredOptions & KismetItemConfigOptions) {
        super(options)
    } 

    public addConnection (item: SequenceAction, outputName: string, inputName: string): this {
        const connection = this.getConnection('output', outputName);
        const itemConnection = item.getConnection('input', inputName);
        
        if (connection && itemConnection) {
            console.log('Added connection')
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
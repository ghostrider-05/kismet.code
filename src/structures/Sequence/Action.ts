import { ItemConnection, SequenceNode } from './Item/index.js'

import { 
    Constants 
} from '../../shared/index.js'

import type { 
    BaseKismetItemOptions,
    KismetActionRequiredOptions 
} from '../../types/index.js'

const { NodeType, ConnectionType } = Constants

export class SequenceAction extends SequenceNode {

    constructor (options: KismetActionRequiredOptions & BaseKismetItemOptions) {
        super({ ...options, type: NodeType.ACTIONS })
    } 

    public addConnection (item: SequenceAction, outputName: string, inputName: string): this {
        const connection = this.getConnection(ConnectionType.OUTPUT, outputName);
        const itemConnection = item.getConnection(ConnectionType.INPUT, inputName) as ItemConnection;
        
        if (connection && itemConnection) {
            this.connections?.output.find(n => n.name === outputName)?.addLink(
                item.linkId, 
                item.connections?.input.indexOf(itemConnection)
            )

            if (typeof this.sequence !== 'string') {
                this.sequence.replaceItem(this.linkId, this)
            }
        } else if (!connection) {
            console.warn(`Could not find output connection for '${outputName}' on ${this['kismet']['class']}`)
        } else {
            console.warn(`Could not find input connection for '${inputName}' on ${item['kismet']['class']}`)
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

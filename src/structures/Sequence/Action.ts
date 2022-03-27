import { ItemConnection, SequenceNode } from './Item/index.js'

import { Constants, KismetError } from '../../shared/index.js'

import type {
    BaseKismetItemOptions,
    KismetActionRequiredOptions
} from '../../types/index.js'

const { NodeType, ConnectionType } = Constants

export class SequenceAction extends SequenceNode {
    constructor (
        options: KismetActionRequiredOptions &
            BaseKismetItemOptions & { isCondition?: boolean }
    ) {
        super({
            ...options,
            type: options.isCondition ? NodeType.CONDITIONS : NodeType.ACTIONS
        })
    }

    public addConnection (
        item: SequenceAction,
        outputName: string,
        inputName: string
    ): this {
        const connection = this.getConnection(ConnectionType.OUTPUT, outputName)
        const itemConnection = item.getConnection(
            ConnectionType.INPUT,
            inputName
        ) as ItemConnection

        if (connection && itemConnection) {
            this.connections?.output
                .find(n => n.name === outputName)
                ?.addLink(
                    item.linkId,
                    item.connections?.input.indexOf(itemConnection)
                )
        } else if (!connection) {
            throw new KismetError('UNKNOWN_CONNECTION', [
                outputName,
                this['kismet']['class']
            ])
        } else {
            throw new KismetError('UNKNOWN_CONNECTION', [
                inputName,
                this['kismet']['class']
            ])
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

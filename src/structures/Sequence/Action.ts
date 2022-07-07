import {
    BaseKismetConnection,
    ItemConnection,
    SequenceNode,
} from './Item/index.js'

import { Constants, KismetError } from '../../shared/index.js'

import type {
    BaseKismetItemOptions,
    KismetActionRequiredOptions,
    KismetConnection,
} from '../../types/index.js'

const { NodeType, ConnectionType } = Constants

export class SequenceAction extends SequenceNode {
    constructor (
        options: KismetActionRequiredOptions &
            BaseKismetItemOptions & { isCondition?: boolean }
    ) {
        super({
            ...options,
            type: options.isCondition ? NodeType.CONDITIONS : NodeType.ACTIONS,
        })
    }

    private _validateConnection (
        fromConnection: KismetConnection | BaseKismetConnection | null,
        toConnection: KismetConnection,
        names: string[]
    ) {
        if (fromConnection && toConnection) {
            return true
        } else if (!fromConnection) {
            throw new KismetError('UNKNOWN_CONNECTION', [
                names[0],
                this['kismet']['class'],
            ])
        } else {
            throw new KismetError('UNKNOWN_CONNECTION', [
                names[1],
                this['kismet']['class'],
            ])
        }
    }

    /**
     * Adds a new output connection
     * @param from Data from this node
     * @param to The node to connect to
     */
    public addOutputConnection (
        from: { name: string },
        to: { name: string; item: SequenceNode }
    ): this {
        const { name: outputName } = from,
            { item, name: inputName } = to

        const connection = this.getConnection(ConnectionType.OUTPUT, outputName)
        const itemConnection = item.getConnection(
            ConnectionType.INPUT,
            inputName
        ) as ItemConnection

        if (
            this._validateConnection(connection, itemConnection, [
                outputName,
                inputName,
            ])
        ) {
            this.connections?.output
                .find(n => n.name === outputName)
                ?.addLink(
                    item.linkId,
                    item.connections?.input.indexOf(itemConnection)
                )
        }

        return this
    }

    /**
     * Set the targets for this node
     * @param objects The object references to the targets
     */
    public setTargets (objects: string[]): this {
        objects.forEach((object, i) => {
            this.setVariable(`Targets(${i})`, object)
        })

        return this
    }
}

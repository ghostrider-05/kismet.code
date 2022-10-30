import { Constants } from '@kismet.ts/shared'

import {
    BaseKismetConnection,
    ItemConnection,
    VariableConnection,
} from './link.js'

import type {
    KismetConnections,
    KismetConnectionType,
} from './link.js'

import type { BaseKismetItemOptions } from './options.js'
import type { KismetVariableValue } from '../structures/index.js'

export class ItemConnectionManager {
    public static emptyConnections: KismetConnections = {
        input: [],
        output: [],
        variable: [],
    }

    public static createConnections (
        inputs: BaseKismetItemOptions['inputs'],
        type?: string
    ): KismetConnections {
        let connections = ItemConnectionManager.emptyConnections

        try {
            connections = ['input', 'output', 'variable']
                .map(key => {
                    const links = inputs[key as keyof typeof inputs]

                    return this.groupConnections(
                        links,
                        <KismetConnectionType>key,
                        type
                    )
                })
                .reduce(
                    (x, y) => ({ ...x, [y.key]: y.connections }),
                    {}
                ) as KismetConnections
        } catch (err) {
            console.log(err, this)
        }

        return connections
    }

    private static groupConnections (
        links: string[] | undefined,
        key: KismetConnectionType,
        type?: string
    ) {
        if (!links)
            return {
                key,
                connections: [],
            }

        if (links.length === 0 && ['input', 'output'].includes(key)) {
            return {
                key,
                connections:
                    type === 'events' && key === 'input'
                        ? []
                        : [
                              new BaseKismetConnection({
                                  input: key === 'input' ? 'In' : 'Out',
                                  type: key,
                              }),
                          ],
            }
        } else
            return {
                key,
                connections: links
                    .map(input => {
                        return BaseKismetConnection.convertLink(key, input)
                    })
                    .filter(n => n != undefined) as (
                    | ItemConnection
                    | VariableConnection
                )[],
            }
    }

    public static isNodePropertyLink (name: string) {
        return [
            Constants.NodeProperty.LINKS_INPUT,
            Constants.NodeProperty.LINKS_OUTPUT,
            Constants.NodeProperty.LINKS_VARIABLE,
        ].some(type => {
            const [prefix, index] = name.split('(')
            return type === prefix && /\(\d+\)/.test(`(${index}`)
        })
    }

    public static fromText (
        input: Record<string, KismetVariableValue>
    ): BaseKismetItemOptions['inputs'] {
        const keys = <[string, string][]>Object.keys(input)
            .map(key =>
                this.isNodePropertyLink(key)
                    ? [key.toLowerCase().split('links')[0], input[key]]
                    : undefined
            )
            .filter(n => n)

        return ['input', 'output', 'variable'].reduce((prev, type) => {
            return {
                ...prev,
                [type]: keys
                    .filter(([t]) => t === type)
                    .map(([, value]) => value),
            }
        }, {} as BaseKismetItemOptions['inputs'])
    }
}

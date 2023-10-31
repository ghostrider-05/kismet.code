import { Constants, mapObjectKeys } from '@kismet.ts/shared'

import {
    BaseKismetConnection,
} from './link.js'

import type {
    KismetConnections,
    KismetConnectionType,
} from './link.js'

import type { BaseKismetItemOptions } from './options.js'
import type { KismetVariableValue } from '../structures/index.js'

export class ItemConnectionManager {
    private static _connectionKeys: (keyof KismetConnections)[] = ['input', 'output', 'variable']

    /**
     * Parsed sockets for this item
     */
    public sockets: KismetConnections;

    /**
     * The raw socket definitions
     */
    public rawInputs: BaseKismetItemOptions['inputs']

    public constructor (inputs: BaseKismetItemOptions['inputs'], private type?: string) {
        this.sockets = ItemConnectionManager.createConnections(inputs, type)
        this.rawInputs = inputs
    }

    private iterate <R> (fn: (connections: KismetConnections[keyof KismetConnections], key: keyof KismetConnections) => R) {
        const output: R[] = []

        for (const key of ItemConnectionManager._connectionKeys) {
            output.push(fn(this.sockets[key], key))
        }

        return output
    }

    /** @deprecated */
    public get input () {
        return this.sockets.input;
    }

    /** @deprecated */
    public get output () {
        return this.sockets.output;
    }

    /** @deprecated */
    public get variable () {
        return this.sockets.variable;
    }

    public get <T extends keyof KismetConnections> (type: T, index: number): KismetConnections[T][number] | undefined;
    public get <T extends keyof KismetConnections> (type: T, name: string | undefined): KismetConnections[T][number] | undefined;
    public get <T extends keyof KismetConnections> (type: T, index: number | (string | undefined)): KismetConnections[T][number] | undefined {
        const compare = (x: BaseKismetConnection) => {
            return typeof index === 'string' ? x.name === index : x.index === (index ?? 0)
        }

        return this.sockets[type].find(x => compare(x))
    }

    public set <T extends keyof KismetConnections> (type: T, link: KismetConnections[T][number]): void {
        this.sockets[type][link.index] = link
    }

    public size (type?: keyof KismetConnections) {
        const links = type ? [this.sockets[type].length] : this.iterate((c) => c.length)

        return links.reduce((a, b) => a + b, 0)
    }

    /**
     * Break all object links to other items.
     * 
     * Same as the editor right click > Break all links to Object(s)
     */
    public breakAllLinks (): void {
        for (const key of ItemConnectionManager._connectionKeys) {
            this.sockets[key] = this.sockets[key].map(link => link.breakAllLinks())
        }
    }

    /**
     * Hide all connection sockets that have no connections currently.
     * 
     * Same as the editor right click > Hide unused connectors
     */
    public hideUnused () {
        for (const key of ItemConnectionManager._connectionKeys) {
            this.sockets[key] = this.sockets[key].map(link => {
                return !link.isUsed ? link.setHidden(true) : link
            })
        }
    }

    /**
     * Show all connection sockets.
     * 
     * Same as the editor right click > Show all connectors
     */
    public showAll () {
        for (const key of ItemConnectionManager._connectionKeys) {
            this.sockets[key] = this.sockets[key].map(link => link.setHidden(false))
        }
    }

    public toJSON () {
        const sockets = this.sockets ?? ItemConnectionManager.emptyConnections

        const values = mapObjectKeys(sockets, (connection, index) => ({
            prefix: connection.prefix(index),
            value: connection.value
        }))

        return values
            .filter(n => n.length > 0)
            .flat()
            .reduce((acc, con) => ({ ...acc, [con.prefix]: con.value }), {} as Record<string, string>)
    }

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
            connections = (this._connectionKeys as (keyof BaseKismetItemOptions['inputs'])[])
                .map(key => {
                    return this.groupConnections(inputs[key], key, type)
                })
                .reduce(
                    (x, y) => ({ ...x, [y.key]: y.connections.map((c, i) => { c.index = i; return c; }) }),
                    {}
                ) as KismetConnections
        } catch (err) {
            console.log(err, this)
        }

        return connections
    }

    private static groupConnections <T extends KismetConnectionType> (
        links: string[] | undefined,
        key: T,
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
                    .map(input => BaseKismetConnection.convertLink(key, input))
                    .filter((n): n is NonNullable<typeof n> => n != undefined),
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

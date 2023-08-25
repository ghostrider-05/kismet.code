import { KismetFile, ISingleStore, IStore, SequenceItemType, SequenceItemTypeof } from '@kismet.ts/core'
import { constructItem, Constants } from '@kismet.ts/shared'

import * as Actions from './actions/index.js'
import * as Events from './events/index.js'
import * as Conditions from './conditions/index.js'
import * as Variables from './variables/index.js'

/**
 * Default Rocket League nodes (actions, conditions, events) + default UDK nodes
 */
const Items = {
    Actions,
    Conditions,
    Variables,
    Events,
} satisfies MainStore;

export type ActionStore = IStore<typeof Actions[keyof typeof Actions]>
export type ConditionStore = IStore<typeof Conditions[keyof typeof Conditions]>
export type EventStore = IStore<typeof Events[keyof typeof Events]>
export type VariableStore = ISingleStore<typeof Variables[keyof typeof Variables]>

export interface MainStore {
    Actions: ActionStore,
    Conditions: ConditionStore,
    Events: EventStore,
    Variables: VariableStore
}

export function createStore <T extends SequenceItemTypeof> (items: T[], type: Constants.NodeType): IStore<T> {
    return items
        .filter(item => constructItem<SequenceItemType, SequenceItemTypeof>(item).type === type)
        .reduce((prev, item) => ({
            ...prev,
            [item.name]: item
        }), {})
}

/**
 * Convert the default items ({@link Items}) to an array of items
 * @returns The converted nodes
 */
export function listDefaultItems () {
    return KismetFile.listItems(Items)
}

/**
 * Convert the default items ({@link Items}) to an array of items and constructs the classes
 * @returns The constructed nodes
 */
export function listItems (): SequenceItemType[] {
    return listDefaultItems()
        .map(item => constructItem(item))
}

/** @deprecated use {@link listItems} instead */
export const defaultItems: SequenceItemType[] = listDefaultItems()
    .map(item => constructItem(item))

export * from './version.js'
export {
    Items,
    Actions,
    Conditions,
    Events,
    Variables
}
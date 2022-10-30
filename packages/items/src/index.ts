import { KismetFile, ISingleStore, IStore, SequenceItemTypeof, SequenceItemType } from '@kismet.ts/core'

import * as Actions from './actions/index.js'
import * as Events from './events/index.js'
import * as Conditions from './conditions/index.js'
import * as Variables from './variables/index.js'

/**
 * Default Rocket League nodes (actions, conditions, events) + default UDK nodes
 */
const Items: MainStore = {
    Actions,
    Conditions,
    Variables,
    Events,
}

export type ActionStore = IStore<typeof Actions[keyof typeof Actions]>
export type ConditionStore = IStore<typeof Conditions[keyof typeof Conditions]>
export type EventStore = IStore<typeof Events[keyof typeof Events]>
export type VariableStore = ISingleStore<typeof Variables[keyof typeof Variables]>

export type MainStore = {
    Actions: ActionStore,
    Conditions: ConditionStore,
    Events: EventStore,
    Variables: VariableStore
}

/**
 * Convert the default items ({@link Items}) to an array of items
 * @returns The converted nodes
 */
export function listDefaultItems () {
    return KismetFile.listItems(Items)
}

export * from './version.js'
export {
    Items,
    Actions,
    Conditions,
    Events,
    Variables
}
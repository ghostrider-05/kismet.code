import { 
    type ISingleStore, 
    type IStore, 
    type SequenceItemType,
     type SequenceItemTypeof,
} from '@kismet.ts/core'
import { constructItem, Constants } from '@kismet.ts/shared'

import type * as Actions from './actions/index.js'
import type * as Events from './events/index.js'
import type * as Conditions from './conditions/index.js'
import type * as Variables from './variables/index.js'

export type ActionStore = IStore<typeof Actions[keyof typeof Actions]>
export type ConditionStore = IStore<typeof Conditions[keyof typeof Conditions]>
export type EventStore = IStore<typeof Events[keyof typeof Events]>
export type VariableStore = ISingleStore<typeof Variables[keyof typeof Variables]>

export interface MainStore {
    Actions: ActionStore,
    Conditions: ConditionStore,
    Events: EventStore,
    Variables: VariableStore,
}

export function createStore <T extends SequenceItemTypeof> (items: T[], type: Constants.NodeType): IStore<T> {
    return items
        .filter(item => constructItem<SequenceItemType, SequenceItemTypeof>(item).type === type)
        .reduce((prev, item) => ({
            ...prev,
            [item.name]: item
        }), {})
}
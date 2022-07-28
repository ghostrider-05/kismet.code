import { KismetFile } from '@kismet.ts/core'

import * as Actions from './actions/index.js'
import * as Events from './events/index.js'
import * as Conditions from './conditions/index.js'
import * as Variables from './variables/index.js'

/**
 * Default Rocket League nodes (actions, conditions, events) + default UDK nodes
 * @version 2.13
 */
const Items = {
    Actions,
    Conditions,
    Variables,
    Events,
}

/**
 * Convert the default items ({@link Items}) to an array of items
 * @returns The converted nodes
 */
export function listDefaultItems () {
    return KismetFile.listItems(<never>Items)
}

export {
    Items,
    Actions,
    Conditions,
    Events,
    Variables
}
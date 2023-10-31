import { KismetFile, type SequenceItemType } from '@kismet.ts/core'
import { constructItem } from '@kismet.ts/shared'

import * as Actions from './actions/index.js'
import * as Events from './events/index.js'
import * as Conditions from './conditions/index.js'
import * as Variables from './variables/index.js'

import type { MainStore } from './store.js'

/**
 * Default Rocket League nodes (actions, conditions, events) + default UDK nodes
 */
export const Items = {
    Actions,
    Conditions,
    Variables,
    Events,
} satisfies MainStore;

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

export class ItemArray {
    public constructor (private items: SequenceItemType[]) {}

    public static list = listItems
    public static listDefault = listDefaultItems

    public filter (
        text: string,
        max: number
    ) {
        const input = text.toLowerCase();
        const itemNames = this.items.flatMap(i => [i.name, i.rawName, i.ClassData.Class]);
    
        return itemNames.filter((name, i) => {
            return itemNames.indexOf(name) === i
                && (name.match(/\d+$/gm)?.length || 0) === 0
                && (name === input || name.toLowerCase().includes(input));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        }).map(name => name ? ({ name, value: name }) : undefined!)
            .filter((_, i) => _ != undefined && i < max);
    }

    public find (name: string) {
        return this.items.find(item => {
            return item.name === name
                || item.rawName === name
                || item.ClassData.Class === name;
        });
    }
}

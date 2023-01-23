import { IStore, SequenceItemTypeof } from "@kismet.ts/core";

export interface IStoreCompareResult {
    missingStore: string[]
    missingComparedList: string[]
}

export function compareStores (first: IStore, compare: string[]): IStoreCompareResult {
    const excludeArray = <T = unknown>(base: T[], exclude: T[]) => {
        return base.filter(i => !exclude.includes(i))
    }

    const names = Object.keys(first)
    const classNames = names.map(name => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const item = new (first[name] as SequenceItemTypeof)({})

        return item.ClassData.Class
    })

    return {
        missingStore: excludeArray(classNames, compare),
        missingComparedList: excludeArray(compare, classNames)
    }
}
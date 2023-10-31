import { existsSync, readdirSync } from "fs"
import { join } from "path"

import { type RawUnrealClassCompareResult, UnrealClassesComparer } from "./comparer.js"
import { extractSourceFile } from "./parse.js"

import { 
    type LocalInstalledClassesDiff,
    type LocalInstalledClassSummary
} from "../compare.js"

export function checkFiles (
    path: string, 
    localAbsolutePath: string,
    checkIfNotEmptyClass: (result: RawUnrealClassCompareResult) => boolean,
    { checkDeleted, checkDeletedFolders, includeDiff, path: extractedPath, filter }: { 
        path?: string
        checkDeleted: boolean
        checkDeletedFolders?: boolean
        includeDiff?: boolean
        filter?: (folder: string) => boolean
    }
) {
    const missing: [string, string][] = []
    const deleted: [string, string][] = []
    const diffs: RawUnrealClassCompareResult[] = []

    const folders = (filter ? readdirSync(path).filter(filter) : readdirSync(path))
        .filter(n => !n.includes('.'))

    if (checkDeletedFolders && filter && extractedPath) {
        for (const folder of readdirSync(localAbsolutePath).filter(filter).filter(name => !existsSync(join(extractedPath, name)))) {
            for (const file of readdirSync(join(localAbsolutePath, folder, 'Classes'))) {
                deleted.push([folder, file])
            }
        }
    }

    for (const folder of folders) {
        for (const name of readdirSync(join(path, folder, 'Classes')).filter(n => n.endsWith('uc'))) {
            const local = join(localAbsolutePath, folder, 'Classes', name)
            const extracted = join(path, folder, 'Classes', name)

            if (!existsSync(local)) {
                missing.push([folder, name])
            } else if (includeDiff) {
                const result = new UnrealClassesComparer(extractSourceFile(local), extractSourceFile(extracted))
                    .compare()
                if (checkIfNotEmptyClass(result)) diffs.push(result)
            }
        }

        if (checkDeleted) {
            for (const name of readdirSync(join(localAbsolutePath, folder, 'Classes')).filter(n => n.endsWith('uc'))) {
                const fileIsDeleted = extractedPath
                    && !existsSync(join(path, folder, 'Classes', name))
                    && !existsSync(join(extractedPath, folder, 'Classes', name));

                if (fileIsDeleted) {
                    deleted.push([folder, name])
                }
            }
        }
    }

    return {
        diffs,
        missing,
        deleted
    }
}

export function combineChecks (...checks: ReturnType<typeof checkFiles>[]): LocalInstalledClassesDiff {
    const combine = <T extends [string, string] | [string, string, string]>(items: T[]) => items
        .filter(n => !n[1].startsWith('__'))
        .sort((a, b) => {
            const pkgInt = a[0].localeCompare(b[0]);
            return pkgInt === 0 ? a[1].localeCompare(b[1]) : pkgInt
        })

    const summary = combine(checks.flatMap(check => {
        const items = check.missing.map(c => [...c, 'added'])
            .concat(check.deleted.map(c => [...c, 'deleted'])) as LocalInstalledClassSummary[]

        return items
    }))

    return {
        files: {
            added: checks.flatMap(check => combine(check.missing)),
            deleted: checks.flatMap(check => combine(check.deleted)),
        },
        summary,
        summary_kismet: summary.filter(([, name]) => name.match(/^Seq(Act|Cond|Event|Var)_/) != null),
        classes: checks.flatMap(c => c.diffs),
    }
}
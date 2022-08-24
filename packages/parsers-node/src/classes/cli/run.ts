import { config } from 'dotenv'

import { cast } from '@kismet.ts/shared'

import { createLocalClasses } from '../index.js'

config()

const groupItems =
    'KISMET_GROUP_ITEMS' in process.env
        ? cast<boolean>(process.env.KISMET_GROUP_ITEMS)
        : false
const importPath =
    'KISMET_IMPORT_PATH' in process.env
        ? <string>process.env.KISMET_IMPORT_PATH
        : null
const exportPath =
    'KISMET_EXPORT_PATH' in process.env
        ? <string>process.env.KISMET_EXPORT_PATH
        : null

if (!importPath || !exportPath) {
    console.error(
        'Could not find path: ' + !importPath ? importPath : exportPath
    )
} else {
    await createLocalClasses(
        {
            importPath,
            exportPath,
            groupItems
        }
    )
}

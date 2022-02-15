import { config } from 'dotenv'

import { findClasses } from './index.js'

import { t } from '../shared/index.js'

config()

const groupItems =
    'KISMET_GROUP_ITEMS' in process.env
        ? t<boolean>(process.env.KISMET_GROUP_ITEMS)
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
    await findClasses(
        {
            importPath,
            exportPath
        },
        { groupItems }
    )
}

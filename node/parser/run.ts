import { findClasses } from './index.js'

import { t } from '../shared/index.js'

const groupItems = ('KISMET_GROUP_ITEMS' in process.env) ? t<boolean>(process.env.KISMET_GROUP_ITEMS) : false

await findClasses(groupItems)
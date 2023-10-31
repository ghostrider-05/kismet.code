import { writeFileSync } from 'fs'
import { createCompactRecursiveTree } from '@kismet.ts/parsers-node'

import classes from '../src/classes.json' assert { type: 'json' }
import config from './update-config.json' assert { type: 'json' }

const tree = createCompactRecursiveTree({ 
    classes: <never>classes, 
    className: 'Car_TA',
    depth: 8,
    metadata: { version: config.version }
})

writeFileSync('./compact_tree.json', JSON.stringify(tree))
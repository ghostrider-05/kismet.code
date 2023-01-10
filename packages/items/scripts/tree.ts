import * as fs from 'fs'
import { resolve } from 'path'

import { createRecursiveTree } from '@kismet.ts/parsers-node'

import classes from '../src/classes.json' assert { type: 'json' }

type Classes = Parameters<typeof createRecursiveTree>[0]

console.log('Loading tree...');
const tree = createRecursiveTree(<Classes>classes, { className: 'Car_TA', max: 2 });

fs.writeFileSync('./tree.json', JSON.stringify(tree), { encoding: 'utf8' })

const path = resolve('.', './src/nodes.json')

const nodes = fs.readFileSync(path, { encoding: 'utf8' })

const packages = ['ProjectX', 'TAGame']

fs.writeFileSync('./nodes_tree.json',
    JSON.stringify((<Classes>JSON.parse(nodes))
        .filter(n => packages.includes(n.Package))
        .map(item => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { structures, enums, Extends, placeable, ...i } = item
            return i
        })
    )
)

import inquirer from 'inquirer';
import * as fs from 'fs';

import { createLocalClasses, createClassFileData, nodeToJSON } from '@kismet.ts/parsers-node'
import { Constants, constructItem, quote } from '@kismet.ts/shared'
import { Items } from '../src/index.js'

import config from './update-config.json' assert { type: 'json' }
import { KismetFile, SequenceItemType, SequenceItemTypeof } from '@kismet.ts/core';

const { NodeType } = Constants

const prompt: { version: string } = config.version ? { version: config.version } : await inquirer.prompt([
    {
        type: 'input',
        name: 'version',
        message: 'Type the latest changelog number'
    }
])

const nodes = KismetFile
    .listItems({ Variables: Items.Variables, Actions: {}, Conditions: {}, Events: {} })
    .map(item => {
        const node = nodeToJSON(createClassFileData(constructItem(item)), true)
        const n = constructItem<SequenceItemType, SequenceItemTypeof>(item)
        n.toString()

        node.links.variable = n.raw.map(r => ({ name: r[0] }))

        node.archetype = quote(node.archetype)

        return node
    })


await createLocalClasses ({
    groupItems: true,
    importPath: config.importPath,
    exportPath: './src/',
    types: [NodeType.ACTIONS, NodeType.CONDITIONS, NodeType.EVENTS ],
    blender: true,
    blenderOptions: {
        copy: false,
        log: true,
        register: true,
        standalone: true,
        additionalNodes: nodes
    },
    classes: true,
    debug: true,
    version: prompt.version,
    writeIndexFile: false
})

const exp = new RegExp(/\tProducts_New\((\d+)\)=Product_TA'ProductsDB\.Products\.(.+)'/g)

const content = fs.readFileSync(config.database, { encoding: 'utf8' })
    .split(/\n|\r\n/g)
    .filter(l => l != undefined && l.startsWith('\tProducts_New') && !l.endsWith('=none'))
    .map(line => exp.exec(line))
    .map(e => ({ [e?.at(1)?.toString() ?? '']: e?.at(2) }))
    .reduce((prev, e) => ({ ...prev, ...e}), {})
console.log(JSON.stringify(content, null, 4))
fs.writeFileSync('./db.json', JSON.stringify(content, null, 4), { encoding: 'utf8' })

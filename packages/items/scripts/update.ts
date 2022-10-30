import inquirer from 'inquirer';

import { createLocalClasses } from '@kismet.ts/parsers-node'
import { Constants } from '@kismet.ts/shared'

import config from './update-config.json' assert { type: 'json' }

const { NodeType } = Constants

const prompt = await inquirer.prompt([
    {
        type: 'input',
        name: 'version',
        message: 'Type the latest changelog number'
    }
])

await createLocalClasses ({
    groupItems: true,
    importPath: config.importPath,
    exportPath: './src/',
    types: [NodeType.ACTIONS, NodeType.CONDITIONS, NodeType.EVENTS ],
    blender: true,
    blenderOptions: {
        copy: false,
        log: true,
        register: true
    },
    classes: true,
    debug: true,
    version: prompt.version,
    writeIndexFile: false
})
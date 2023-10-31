import * as fs from 'fs';

import inquirer from 'inquirer';
import fetch from 'node-fetch';

import config from './update-config.json' assert { type: 'json' }

const prompt: { version: string } = config.version ? { version: config.version } : await inquirer.prompt([
    {
        type: 'input',
        name: 'version',
        message: 'Type the latest changelog number'
    }
])

const files: [string, Promise<string> | string][] = [
    ['itemdb', fs.readFileSync('./db.json', { encoding: 'utf8' })],
    ['classes', fs.readFileSync('./src/classes.json', { encoding: 'utf8' })],
    ['nodes', fs.readFileSync('./src/nodes.json', { encoding: 'utf8' })],
    ['blender', fs.promises.readFile('./src/kismet-addon.py', { encoding: 'utf8' })],
    // Update this first in ./scripts/tree.ts
    ['tree', fs.promises.readFile('./tree.json', { encoding: 'utf8' })],
    ['compact_tree', fs.promises.readFile('./compact_tree.json', { encoding: 'utf8' })],
    ['nodes_automated', fs.promises.readFile('./nodes_tree.json', { encoding: 'utf8' })],
    ['history', fs.promises.readFile('./node-history-tree.json', { encoding: 'utf8' })],
]

await Promise.all(files.map(async file => {
    const [name, content] = file
    const body = await content
    console.log(`uploading ${name}`)

    return fetch(config.uploadPath + `?tag=${name}&version=${prompt.version}`, {
        method: 'PUT',
        headers: {
            'Authorization': config.Authorization,
        },
        body
    }).then(res => res.status === 200 ? null : console.log(res))
}))
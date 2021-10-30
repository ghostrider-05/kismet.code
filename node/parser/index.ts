import * as fs from 'fs';
import { resolve } from 'path';

import { filterEmptyLines } from '../shared/index.js';
import { readNodeFile } from './read.js';

import { actions } from './templates.js'

import { 
    RawUnrealJsonFile 
} from '../types/index.js'

const importPath = 'IMPORT_PATH';
const outputPath = './node/test/'

export async function findClasses (): Promise<void> {
    const Packages = fs.readdirSync(importPath);

    for (const Package of Packages) {
        const path = [importPath]
            .concat(Package, '.Classes', '.json')
            .join('\\')

        if (!fs.existsSync(path)) {
            console.log(`Could not find path: ${path}`)
            continue;
        }

        const folderItems = fs.readdirSync(path).filter(file => {
            return file.toLowerCase().startsWith('seq') && !file.startsWith('Sequence')
        })

        for (const file of folderItems) {
            const fileContent = fs.readFileSync(path + '\\' + file, 'utf-8')
            const fileJSON = JSON.parse(fileContent) as RawUnrealJsonFile

            const node = readNodeFile(fileJSON)
                
            const output = outputPath.concat(`${node.type}/${node.name}.ts`)

            switch (node.type) {
                case 'actions':
                    return fs.writeFile(resolve('.', output), filterEmptyLines(actions(node)), (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                default:
                    console.log('Invalid type for class:' + node.Class)
                    continue;
            }
        }
    }
}
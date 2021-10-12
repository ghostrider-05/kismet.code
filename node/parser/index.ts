import * as fs from 'fs';
import { resolve } from 'path';

import { actions } from './templates.js'

const importPath = 'IMPORT_PATH';

const transformName = (name: string | undefined) => {
    if (!name || (name?.indexOf(' ') ?? -1) < 0) return name;

    return name.split(' ').map((word, i) => i === 0 ? word[0].toLowerCase() + word.slice(1) : word).join('')
}

const filterRecordList = (list: Record<string, string>[], start: string)  => list.filter(n => n.name.startsWith(start)).map(x => x.value)

const getType = (Class: string) => [
    {
        class: 'SequenceEvent',
        type: 'events'
    },
    {
        class: 'SequenceAction',
        type: 'actions'
    },
    {
        class: 'SequenceCondition',
        type: 'conditions'
    }
].find(x => x.class === Class)?.type

export async function findClasses (): Promise<void> {
    const Packages = fs.readdirSync(importPath);

    for (const Package of Packages) {
        const path = [importPath]
            .concat(Package, '.Classes', '.json')
            .join('\\')

        if (fs.existsSync(path)) {
            const folderItems = fs.readdirSync(path).filter(file => {
                return file.toLowerCase().startsWith('seq') && !file.startsWith('Sequence')
            })

            for (const file of folderItems) {
                const filecontent = JSON.parse(fs.readFileSync(path + '\\' + file, 'utf-8'))
                
                const { 
                    name, 
                    extends: Extends, 
                    defaultproperties, 
                    variables 
                } = filecontent;

                const defaultProps = (defaultproperties as Record<string, string>[])
                const defaultProperties = defaultProps.filter(n => !['ObjName', 'ObjCategory'].includes(n.name))

                const node = {
                    name: transformName(defaultProps.find(p => p.name === 'ObjName')?.value)?.replaceAll('"', '') ?? '',
                    class: name,
                    variables,
                    package: defaultProps.find(p => p.name === 'ObjCategory')?.value,
                    defaultproperties: defaultProperties,
                    type: getType(Extends),
                    archetype: `"${name}'${Package}.Default__${name}'"`,
                    links: {
                        input: filterRecordList(defaultProps, 'InputLinks('),
                        output: filterRecordList(defaultProps, 'OutputLinks('),
                        variable: filterRecordList(defaultProps, 'VariableLinks(')
                    }
                }

                const outputPath = `./node/test/${node.type}/${node.name}.ts`

                if (node.type === 'actions') {
                    const content = actions(node);

                    fs.writeFile(resolve('.', outputPath), content, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            }
        }
    }
}
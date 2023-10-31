import * as fs from 'fs'
import { resolve } from 'path'

import { createRecursiveTree } from '@kismet.ts/parsers-node'

import classes from '../src/classes.json' assert { type: 'json' }
import config from './update-config.json' assert { type: 'json' }
import { KismetGitHub } from './commits.js'

type Classes = (Parameters<typeof createRecursiveTree>[0][number] & {
    displayName:       string;
    category?:         string;
    links: Record<'input' | 'output' | 'variable', { name: string }[]>
})[]

console.log('Loading tree...');
const tree = createRecursiveTree(<Classes>classes, { className: 'Car_TA', max: 2, metadata: { version: config.version }  });

fs.writeFileSync('./tree.json', JSON.stringify(tree), { encoding: 'utf8' })

const nodes = fs.readFileSync(resolve('.', './src/nodes.json'), { encoding: 'utf8' })
const rawNodes = <Classes>JSON.parse(nodes)

const packages = ['ProjectX', 'TAGame']

const git = new KismetGitHub()

await git.findHistory(rawNodes.map(x => x.Class))

fs.writeFileSync('./node-history-tree.json', JSON.stringify(git.foundNames))

const escape = <T extends string | undefined>(name: T): T => name?.replace("\"", "").replace("\"", "") as T

fs.writeFileSync('./nodes_tree.json',
    JSON.stringify(rawNodes
        .filter(n => packages.includes(n.Package))
        .map(item => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { structures, enums, Extends, placeable, ...i } = item

            const replaceName = (item: { name: string }) => {
                item.name = escape(item.name)
                return item
            }

            const { Class, Package, archetype, name, variables, displayName, category, links, ...include  } = i
            return {
                name,
                Class,
                Package,
                displayName: escape(displayName),
                last_updated: git.get(Class),
                archetype: escape(archetype),
                category: escape(category),
                variables: variables.map(v => {
                    const { replicated, ...va } = v

                    return {
                        ...va,
                        replicated: replicated === 'True',
                    }
                }),
                ...include,
                links: {
                    input: links.input.map(replaceName),
                    output: links.output.map(replaceName),
                    variable: links.variable.map(replaceName),
                },
            }
        })
    )
)

import { extname, join, resolve } from 'node:path'

import { type Command } from 'commander'
import { mkdir, readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'

interface Options {
    name: string
    description: string
    platform?: string
}

export function createTemplateCommand (program: Command) {
    program
        .command('create')
        .description('Add folders using a template')
        .argument('<string>', 'the type of template to use')
        .option('-n, --name <string>', 'the name of the item')
        .option('-d, --description <string>', 'the description of the item')
        .option('-p, --platform [string]', 'for packages, the platform compatibility')
        .action(async (type: string, options: Options) => {
            console.log(type, options)

            const createOptions = type === 'worker' ? createWorker : type === 'package' ? createPackage : undefined

            if (!createOptions) throw new Error('Invalid type provided. Must be one of: worker, package')

            await copyTemplate(createOptions(options))
        })
}

interface CopyOptions {
    type: string
    folder: string
    options: Record<string, string>
}

function createPackage ({ name, description, platform}: Options): CopyOptions {
    if (!platform) throw new Error('No platform for this package provided!')
    
    return {
        folder: resolve('.', `./packages/${name}`),
        type: 'package',
        options: {
            name,
            description,
            platform,
        }
    }
}

function createWorker ({ name }: Options): CopyOptions {
    const today = new Date()
    const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    
    return {
        folder: resolve('.', `./apps/workers/${name}`),
        type: 'worker',
        options: {
            name,
            date,
        }
    }
}

async function copyTemplate ({ folder, type, options }: CopyOptions) {
    if (!existsSync(folder)) await mkdir(folder)
    const template = resolve('.', `./packages/kismet.ts/scripts/templates/${type}`)

    const copyFile = async (name: string, parents: string[]) => {
        const dest = resolve(folder, join(...parents.concat(name)))

        const location = resolve(template, join(...parents.concat(name)))

        const content = await readFile(location, { encoding: 'utf-8' })
            .then(content => Object.keys(options).reduce((c, key) => c.replace(`{{${key}}}`, options[key]), content))

        await writeFile(dest, content, { encoding: 'utf-8' })
    }

    const copyFolder = async (parents: string[]) => {
        const path = join(template, ...parents)

        for (const file of await readdir(path)) {
            // is folder
            if (extname(file).length === 0) {
                await copyFolder(parents.concat(file))
            } else {
                await copyFile(file, parents)
            }
        }
    }

    await copyFolder([])
}


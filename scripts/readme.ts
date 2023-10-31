/* eslint-disable @typescript-eslint/no-unused-vars */
import { readdirSync, writeFileSync , readFileSync } from 'fs'
import { resolve } from 'path'

interface Icon {
    text: string
    link: string
    external?: boolean
}

interface Link {
    text: string
    link: string
}

export interface Template {
    name: string
    description: string
    version: string
    scoped?: boolean
    icons: Icon[]
    links: Link[]
    blocks: { title: string, description: string }[]
}

interface Package {
    name: string
    version: string
    description?: string
}

export interface Config {
    folder: string
    template: (template: Template) => string
    config: (name: string, pkg: Package) => Template
}

function combineTemplate (base: Template, pkg: Partial<Template>) {
    for (const [key, value] of Object.entries(pkg)) {
        if (Array.isArray(value)) {
            (<unknown[]>base[<never>key]).push(...value)
        } else if (key === 'description') {
            base[key] += '\n' + value
        } else {
            base[<never>key] = <never>value
        }
    }

    return base
}

function readJSON <T, R extends false = false>(path: string): T | null;
function readJSON <T, R extends true>(path: string): T;
function readJSON <T, R extends boolean = false> (path: string): T | null {
    try {
        return JSON.parse(readFileSync(
            resolve('.', path),
            { encoding: 'utf8' }
        ))
    } catch (err) {
        return null
    }
}

function updateReadmeFiles ({ folder, config, template }: Config) {
    const packageNames = readdirSync(resolve('.', `./${folder}`))

    for (const name of packageNames) {
        const path = resolve('.', `./${folder}/${name}/README.md`)
        const pkg = readJSON<Package, true>(`./${folder}/${name}/package.json`)

        const pkgConfig = readJSON<{ readme: Partial<Template> }>(`./${folder}/${name}/config.json`)

        const combined = pkgConfig != null 
            ? combineTemplate(config(name, pkg), pkgConfig.readme) 
            : config(name, pkg)

        writeFileSync(
            path, 
            template(combined),
            { encoding: 'utf8' }
        )
    }
}

// Import and run

const folder = process.argv.at(2) as 'packages' | undefined
if (folder == undefined) process.exit(1)

const config: Config = (await import(`./config/${folder}.readme.js`)).default
updateReadmeFiles(config)

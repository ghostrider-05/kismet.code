import { readdirSync, writeFileSync , readFileSync } from 'fs'
import { resolve } from 'path'

// TODO: allow more than one workspace?
// Definitions

/**
 * @typedef TemplateIcon
 * @type {{ alt: string, link: string}}
 */
/**
 * @typedef TemplateFormat
 * @type {(name: string, config: TemplateConfig) => string}
 */

/**
 * @typedef BaseTemplateConfig
 * @property {string} folder
 * @property {((version: string) => TemplateConfig)[]} packages
 */

/**
 * @typedef TemplateConfig
 * @property {string} name
 * @property {string} description
 * @property {string} version
 * @property {{ alt: string, link: string}[]} icons
 * @property {{ text: string, link: string }[]} links
 * @property {{ title: string, description: string }[]} blocks
 */

/**
 * @param {TemplateFormat} template
 * @param {BaseTemplateConfig} config
 */
function updateMonorepoReadmes (template, { folder, packages }) {
    const packageNames = readdirSync(resolve('.', `./${folder}`))

    for (const name of packageNames) {
        const path = resolve('.', `./${folder}/${name}/README.md`)
        const { description, version } = JSON.parse(readFileSync(
            resolve('.', `./${folder}/${name}/README.md`),
            { encoding: 'utf8' }
            ))
    
        const config = packages.find(p => p.name == name)

        if (config) writeFileSync(
            path, 
            template(name, { 
                description: description.length > 0 ? `\n${description}` : '', 
                ...config(version) }),
            { encoding: 'utf8'}
            )
    }
}

// Import and run

import template from '../configs/.readme-template.js'
import config from '../configs/.readme-config.js'

updateMonorepoReadmes(template, config)
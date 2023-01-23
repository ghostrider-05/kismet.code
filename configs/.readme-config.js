import { readdirSync } from "fs";
import { resolve } from "path";

const NodeJsPackages = new Set()
    .add('kismet.ts')
    .add('parsers-node')
    .add('util')

/**
 * @type {import("../scripts/readme").BaseTemplateConfig}
 */
export default {
    folder: 'packages',
    packages: readdirSync(resolve('.', './packages')).map(name => {
        const nodeShield = NodeJsPackages.has(name) ? 'node.js-green' : 'browser/serverless-blue'

        /**
         * @type {import("../scripts/readme").BaseTemplateConfig['packages'][0]}
         */
        const config = (version) => ({
            name,
            icons: [
                {
                    alt: 'version',
                    link: `https://img.shields.io/badge/version-${version}-orange`
                },
                {
                    alt: 'compatibility',
                    link: `https://img.shields.io/badge/compatibility-${nodeShield}`
                }
            ]
        })

        return config
    })
}
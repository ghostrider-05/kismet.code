import type { Config } from "../readme.js";

const NodePackages = new Set()
    .add('kismet.ts')
    .add('image')
    .add('parsers-node')
    .add('util')

export default<Config> {
    folder: 'packages',
    template: function (config) {
        return [
            `# ${config.scoped ? `@kismet.ts/` : ''}${config.name}`, '',

            ...config.icons.map(icon => `${!icon.external ? '!' : ''}[${icon.text || ''}](${icon.link})`), '',
            config.description + (config.description.length > 0 ? '\n' : ''),

            '## Installation\n',
            `\`\`\`sh\nnpm install @kismet.ts/${config.name}\npnpm add @kismet.ts/${config.name}\n\`\`\`\n`,

            ...(config.links.length > 0 
                    ? ['## Links\n', config.links.map(link => `- [${link.text}](${link.link})`).join('\n') + '\n']
                    : []
            ),
        ].join('\n')
    },
    config: function (name, { version, description }) {
        const nodeShield = NodePackages.has(name) ? 'node.js-green' : 'browser/serverless-blue'

        return {
            name,
            scoped: name !== 'kismet.ts',
            description: description ?? '',
            version,
            links: [
                {
                    text: 'Documentation',
                    link: `https://kismet.ghostrider-05.com/${name}/`
                },
                {
                    text: 'Reference',
                    link: `https://kismet.ghostrider-05.com/${name}/reference/modules.html`
                },
                {
                    text: 'Template',
                    link: 'https://github.com/ghostrider-05/kismet.ts-template',
                }
            ],
            blocks: [],
            icons: [
                {
                    text: 'version',
                    link: `https://img.shields.io/badge/version-${version}-orange`
                },
                {
                    text: 'compatibility',
                    link: `https://img.shields.io/badge/compatibility-${nodeShield}`
                }
            ]
        }
    }
}
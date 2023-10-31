import { existsSync, readdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

import { defaultTheme, defineUserConfig, type SidebarGroup } from 'vuepress'

const packageFolder = resolve('.', '../../packages')

const packages = readdirSync(packageFolder)
    .filter(name => existsSync(join(packageFolder, name, 'docs')))

const items: SidebarGroup[] = []

await fetch('https://raw.githubusercontent.com/ghostrider-05/kismet.ts-template/main/src/index.ts')
    .then(res => res.text())
    .then(text => writeFileSync(join('src', '.vuepress', 'example.ts'), text))

export default defineUserConfig({
    title: 'Kismet.ts',
    description: 'Create kismet from code',
    port: 8099,
    head: [
        ['link', {rel: 'icon', href: './icon_dark.svg'}]
    ],
    pagePatterns: [
        '**/*.md', 
        '!../packages/**/node_modules/**/*.md',
        '!.vuepress', 
        '!node_modules'
    ],
    extendsPage(page, app) {
        //@ts-ignore
        page.data.packages = packages
    },
    theme: defaultTheme({
        repo: 'ghostrider-05/kismet.ts',
        contributors: false,
        logo: './icon_light.svg',
        logoDark: '/icon_dark.svg',
        navbar: [
            {
                text: 'Documentation',
                link: '/kismet.ts/index.html',
            },
        ],
        sidebar: {
            ...packages.reduce((prev, name) => ({ 
                ...prev, 
                [`/${name}/`]: items 
            }), {})
        },
    }),
    async onInitialized() {
        for (const pkg of packages) {
            const packageName = pkg === 'kismet.ts' ? pkg : `@kismet.ts/${pkg}`

            items.push({ text: packageName, link: `${pkg}/index.html`, children: packageName[0] !== '@' ? [] : [{
                text: 'Reference',
                link: `/${pkg}/reference/`
            }]})

            const files = readdirSync(join(packageFolder, pkg, 'docs'))

            if (files.some(file => file === 'index.md')) {
                items.at(-1)!.children.push({ text: 'Getting started', link: `/${pkg}/index.html`, children: [] })
            }

            for (const item of files) {
                if (item.endsWith('.md') && item !== 'index.md') {
                    items.at(-1)!.children.push(`/${pkg}/${item.slice(0, -3)}.html`)
                } else if (!item.includes('.')) {
                    items.at(-1)?.children.push({ text: item, children: [] })

                    const children = readdirSync(join(packageFolder, pkg, 'docs', item))
                        .filter(child => child.endsWith('.md'))

                    for (const subitem of children) {
                        (items.at(-1)!.children.at(-1) as SidebarGroup).children.push(`/${pkg}/${item}/${subitem.slice(0, -3)}.html`)
                    }
                }
            }
        }
    },
})
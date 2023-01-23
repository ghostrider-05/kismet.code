import { defaultTheme, defineUserConfig, SidebarGroup } from 'vuepress'
import fetch from 'node-fetch'
import { existsSync, readdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { mkdir, rename } from 'fs/promises'

const packages = readdirSync(resolve('.', './packages/'))
    .filter(name => existsSync(resolve('.', `./packages/${name}/docs/`)))
const items: SidebarGroup[] = []

export default defineUserConfig({
    title: 'Kismet.ts',
    description: 'Create kismet from code',
    port: 8099,
    head: [
        ['link', {rel: 'icon', href: './icon_dark.svg'}]
    ],
    pagePatterns: [
        '**/*.md', 
        '../packages/**/docs/*.md',
        '../packages/**/docs/**/*.md',
        '!../packages/**/node_modules/**/*.md',
        '!.vuepress', 
        '!node_modules'
    ],
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
    async onInitialized(app) {
        app.pages.forEach((page, i) => {
                if (page.path.startsWith('/../packages/')) 
                    app.pages[i] = { ...page, path: '/' + page.path.slice('/../packages/'.length).replace('docs/', '') }
            })
        
        await fetch('https://raw.githubusercontent.com/ghostrider-05/kismet.ts-template/main/src/index.ts')
            .then(res => res.text())
            .then(text => writeFileSync('./docs/.vuepress/public/example.ts', text))

        for (const pkg of packages) {
            const packageName = pkg === 'kismet.ts' ? pkg : `@kismet.ts/${pkg}`

            items.push({ text: packageName, link: `${pkg}/index.html`, children: packageName[0] !== '@' ? [] : [{
                text: 'Reference',
                link: `/${pkg}/reference/`
            }]})

            
            const files = readdirSync(resolve('.', `./packages/${pkg}/docs/`))

            if (files.some(file => file === 'index.md')) {
                items.at(-1)!.children.push({ text: 'Getting started', link: `/${pkg}/index.html`, children: [] })
            }

            for (const item of files) {
                if (item.endsWith('.md') && item !== 'index.md') {
                    items.at(-1)!.children.push(`/${pkg}/${item.slice(0, -3)}.html`)
                } else if (!item.includes('.')) {
                    items.at(-1)?.children.push({ text: item, children: [] })

                    const children = readdirSync(resolve('.', `./packages/${pkg}/docs/${item}`))
                        .filter(child => child.endsWith('.md'))

                    for (const subitem of children) {
                        (items.at(-1)!.children.at(-1) as SidebarGroup).children.push(`/${pkg}/${item}/${subitem.slice(0, -3)}.html`)
                    }
                }
            }
        }
    },
    async onGenerated () {
        const folder = join('docs', '.vuepress', 'packages')
        const dist = join('docs', '.vuepress', 'dist')

        for (const pkg of readdirSync(resolve('.', folder))) {
            if (!existsSync(join(dist, pkg))) await mkdir(join(dist, pkg))

            for (const name of readdirSync(resolve('.', join(folder, pkg, 'docs')))) {
                if (name.endsWith('.html')) {
                    await rename(join(folder, pkg, 'docs', name), join(dist, pkg, name))
                } else {
                    await mkdir(join(dist, pkg, name))
                    for (const child of readdirSync(resolve('.', join(folder, pkg, 'docs', name)))) {
                        await rename(join(folder, pkg, 'docs', name, child), join(dist, pkg, name, child))
                    }
                }
            }
        }
    }
})
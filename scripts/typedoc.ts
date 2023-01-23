import typedoc from 'typedoc'
import { existsSync, readdirSync } from 'fs'
import { resolve } from 'path'

const packages = readdirSync(resolve('.', './packages/'))
    .filter(name => existsSync(resolve('.', `./packages/${name}/docs/`)) && name !== 'kismet.ts')

for (const pkg of packages) {
    const doc = new typedoc.Application()

    doc.bootstrap({
        entryPointStrategy: 'packages',
        entryPoints: [`packages/${pkg}`],
        githubPages: false,
        plugin: ['typedoc-plugin-markdown'],
        readme: `./packages/${pkg}/README.md`,
        name: `@kismet.ts/${pkg}`
    })

    const project = doc.convert();
    if (project) {
        await doc.generateDocs(project, `docs/${pkg}/reference/`);
    }
}
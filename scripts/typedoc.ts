import { resolve, join } from 'path'
import { copyFile, cp, readdir } from 'fs/promises'

import typedoc from 'typedoc'

const exists = async (file: string) => (await import('fs')).existsSync(file)

const pkgFolder = resolve('.', './packages/')
const packages = await readdir(pkgFolder)
    .then(folders => {
        return Promise.all(folders.map(async f => {
            return await exists(join(pkgFolder, f, 'docs'))
                .then(exists => ({ exists, pkg: f }))
        }))
    })

for (const { pkg } of packages.filter(p => p.exists)) {
    const pkgDocsFolder = join(pkgFolder, pkg, 'docs')
    const docsFolder = join('apps', 'docs', 'src', pkg)

    if (pkg !== 'kismet.ts') {
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
            await doc.generateDocs(project, docsFolder + '/reference/');
        }
    }

    await copyFile(
        join(pkgFolder, pkg, 'CHANGELOG.md'),
        join(docsFolder, 'CHANGELOG.md')
    )

    await cp(
        pkgDocsFolder,
        resolve('.', docsFolder),
        { recursive: true }
    )
}
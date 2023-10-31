import { Octokit } from 'octokit'

import config from './update-config.json' assert { type: 'json' }

export class KismetGitHub {
    private kit = new Octokit({ auth: config.GITHUB_TOKEN })
    public foundNames: { name: string; v: string }[] = []

    public get (className: string): string | undefined {
        return this.foundNames.find(n => n.name.endsWith(`${className}.uc`))?.v
    }

    private async fetchCommits (prefix: string, amount: number) {
        const commits = await this.kit.rest.repos.listCommits({
            per_page: Math.min(amount, 100),
            owner: 'ghostrider-05',
            repo: config.GITHUB_REPOSITORY,
        })

        return commits.data.filter(c => c.commit.message.startsWith(prefix))
    }

    private async fetchCommit (sha: string, max: number) {
        let depth = 0;

        const fetch = async (page: number): Promise<string[] | undefined> => await this.kit.rest.repos.getCommit({
            owner: 'ghostrider-05',
            repo: config.GITHUB_REPOSITORY,
            ref: sha,
            per_page: 100,
            page,
        }).then(async res => {
            depth += 1;
            const files = res.data.files?.map(x => x.filename)
            if (files?.at(-1)?.startsWith('_') || depth === max) return files

            return ((await fetch(depth + 1)) ?? [] as string[]).concat((files ?? []))
        })

        return await fetch(1)
    }

    public async findHistory (names: string[]) {
        const commits = await this.fetchCommits('update to v2', 50)
        console.log(`Found ${commits.length} commits!`)

        for (const commit of commits) {
            const version = commit.commit.message.split(' ').find(w => w.startsWith('v'))
            if (!version) throw new Error('No version found for commit ' + commit.commit.message)

            if (this.foundNames.length === names.length) {
                console.log('Found all classes by update ' + version)
                break
            }

            const data = await this.fetchCommit(commit.sha, 4)

            if (data) {
                for (const filename of data) {    
                    if (filename.endsWith('.uc') && names.some(n => filename.endsWith(`${n}.uc`)) && !this.foundNames.some(({ name }) => name === filename)) {
                        this.foundNames.push({ name: filename, v: version })
                    }
                }
            }
        }
    }

    public formatHistory (): string {
        let itemsLeft = this.foundNames
        let currentVersion = this.foundNames[0].v
        let output = ''

        while (itemsLeft.length > 0) {
            currentVersion = itemsLeft[0].v
            output += `---- update ${currentVersion} ----\n`
            const currentItems = this.foundNames.filter(({ v }) => v === currentVersion)
            for (const item of currentItems) {
                output += item.name.replace('Classes/', '').replace('.uc', '') + '\n'
            }

            itemsLeft = itemsLeft.filter(({ name }) => !currentItems.some(i => i.name === name))
        }

        return output
    }
}
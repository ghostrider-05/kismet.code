import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

export function readObjInstanceVersions (path: string) {
    const names = new Set<string>();

    const nodes = readdirSync(path)
        .flatMap(name => {
            const folder = join(path, name, 'TheWorld','PersistentLevel','Main_Sequence')
            if (!existsSync(folder)) return []
    
            return readdirSync(folder)
                .filter(n => n.endsWith('.uc'))
                .map(file => {
                    const content = readFileSync(join(path, name, 'TheWorld','PersistentLevel','Main_Sequence', file), { encoding: 'utf8'})
                    const version = content.match(/(?<=ObjInstanceVersion=)(\d+)/)?.[0]

                    return {
                        Class: content.split('\r\n')[0].split('=').at(-1),
                        version: Number(version)
                    }
                })
        })

    return nodes
        .filter(node => {
            if (!node.Class) throw new Error('No Class on ' + JSON.stringify(node))
            const newNode = !names.has(node.Class)

            if (newNode) names.add(node.Class)
            return newNode
        })
}
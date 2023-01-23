import { readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";

import { RawUnrealJsonFile } from "../classes/index.js";

export function loadTree (path: string) {
    const folders = readdirSync(path);
    const nodes: RawUnrealJsonFile[] = [];

    for (const folder of folders) {
        const map = join(path, '\\', folder, '\\.Classes\\.json\\')
        console.log(path, map)
        if (!existsSync(map)) {
            throw new Error('Invalid folder...');
        }

        for (const name of readdirSync(map)) {
            const node = readFileSync(join(map, '\\', name), { encoding: 'utf8'})
            nodes.push(JSON.parse(node));
        }
    }

    return nodes;
}
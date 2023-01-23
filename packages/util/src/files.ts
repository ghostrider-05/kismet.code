import { existsSync, readFileSync } from 'fs';
import { mkdir } from 'fs/promises';

import { resolve } from 'path';

/**
 * Read and parse a JSON file.
 * @param path The path of the JSON file
 * @param encoding The encoding to use
 */
export function readJSONFile <T> (path: string, encoding: BufferEncoding = 'utf8'): T {
    const content = readFileSync(path, { encoding });

    try {
        return JSON.parse(content)
    } catch (err) {
        throw new Error(JSON.stringify(err, null, 4))
    }
}

export function resolvePath (path: string) {
    const resolved = resolve('.', path)
    return existsSync(path) 
        ? path 
        : existsSync(resolved)
            ? resolved
            : undefined
}

export interface ICreateDirectoryOptions {
    recursive?: boolean
    relative?: boolean
}

export async function createDirectory (path: string, options?: ICreateDirectoryOptions) {
    const p = options?.relative ? resolve('.', path) : path

    if (!existsSync(p)) await mkdir(p, { recursive: options?.recursive })
}

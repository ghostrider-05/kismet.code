import { createWriteStream } from 'fs'
import { writeFile } from 'fs/promises'

import { filterEmptyLines } from '@kismet.ts/shared'

export interface PathReadError {
    code: string
    path: string
    syscall: string
}

export const catchFileWriteError = async (
    fn: () => Promise<void>, 
    msg?: (error: PathReadError) => string
) => {
    try {
        await fn()
    } catch (err) {
        const error = err as PathReadError

        if (error.code === 'ENOENT' && error.syscall === 'open') {
            console.warn(msg?.(error) ?? `Invalid path: ${error.path}`)
        } else throw new Error(String(error))
    }
}

export const writeFilteredFile = async (
    path: string,
    content: string
): Promise<void> => {
    return await writeFile(path, filterEmptyLines(content), {
        encoding: 'utf8',
    })
}

export async function writeEmptyFile (path: string, content: string): Promise<void> {
    // Empty file
    await writeFile(path, '')

    const stream = createWriteStream(path, {
        flags: 'a',
    })
    
    stream.write(content)
}
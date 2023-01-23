import { ClipboardUtil, KismetLimitedClipboard } from './clipboard.js'

export class NodeUtil {
    public static clipboard = ClipboardUtil
    public static LimitedClipboard = KismetLimitedClipboard
}

export * from './files.js'

import readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

await new Promise<string>((resolve) => rl.question('copied?', (answer) => resolve(answer)))
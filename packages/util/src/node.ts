import { writeFile } from "fs/promises";
import { join } from "path";
import { KismetFile } from "@kismet.ts/core"

import { ClipboardUtil } from "./clipboard.js"

export class NodeKismetFile extends KismetFile {
    /**
     * Copy the kismet of this project to the clipboard.
     * Use Ctrl+V in UDK to paste the kismet again
     */
    public async copy (): Promise<void> {
        await ClipboardUtil.write(this.mainSequence.toString())
    }

    public async save (folder: string): Promise<void> {
        const path = join(folder, this.projectName + '.txt')

        await writeFile(path, this.mainSequence.toString(), { encoding: 'utf8' })
    }
}
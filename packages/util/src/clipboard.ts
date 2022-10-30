import clipboardy from 'clipboardy'

export class ClipboardUtil {
    public static async read (): Promise<string> {
        return await clipboardy.read()
    }

    public static async write (input: string): Promise<void> {
        return await clipboardy.write(input)
    }
}
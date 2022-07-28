export interface KismetSceneObjectOptions {
    projectName: string
    archetype: string
    index: number
}

export class KismetSceneObject {
    public options: KismetSceneObjectOptions

    constructor (options: KismetSceneObjectOptions) {
        this.options = options
    }

    public get reference (): string {
        return ''
    }
}

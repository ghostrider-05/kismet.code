import { readArchetype } from "@kismet.ts/shared"

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

    public get name (): string {
        const { archetype, index } = this.options;

        return `${readArchetype(archetype).Class}_${index}`
    }
}

export class InputTextManager {
    public items: SequenceItemType[]

    constructor (items: SequenceItemType[]) {
        this.items = items
    }

    private convertVarName (name: string, type: boolean) {
        if (name !== 'Int' && name !== 'Integer') return name

        return type ? 'Integer' : 'Int'
    }

    public findName (name: string): SequenceItemType | undefined {
        const filter = (_a: string, _b: string) => {
            const a = _a.toLowerCase(),
                b = _b.toLowerCase()

            return a === b || a.split('_')[1] === b
        }

        const item = this.items.find(item => {
            return (
                filter(item.name, name) ||
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                filter(new item()['kismet'].class, name)
            )
        })

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return item ? new item() : undefined
    }

    public findVariable (name: string | undefined): SequenceVariable {
        if (!name) throw new Error('Unknown property variable')

        const variable =
            Variables[<keyof typeof Variables>this.convertVarName(name, true)]

        if (!variable) throw new Error('Unknown property variable: ' + name)

        return new variable()
    }

    public findVariableType (variable: SequenceVariable): string | undefined {
        const name = Object.keys(Variables).find(_key => {
            const key = _key as keyof typeof Variables

            return variable instanceof Variables[key]
        })

        return name ? this.convertVarName(name, false) : undefined
    }
}
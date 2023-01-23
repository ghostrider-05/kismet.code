import { SequenceItemType, SequenceVariable, ISingleStore } from "@kismet.ts/core"
import { constructItem } from "@kismet.ts/shared"

export class InputTextManager {
    constructor (public items: SequenceItemType[], public variables: ISingleStore) {

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
                filter(item.ClassData.Class, name)
            )
        })

        return item ?? undefined
    }

    public findVariable (name: string | undefined): SequenceVariable {
        if (!name) throw new Error('Unknown property variable')

        const variable =
            this.variables[<keyof typeof this.variables>this.convertVarName(name, true)]

        if (!variable) throw new Error('Unknown property variable: ' + name)

        return constructItem(variable)
    }

    public findVariableType (variable: SequenceVariable): string | undefined {
        const name = Object.keys(this.variables).find(_key => {
            const key = _key as keyof typeof this.variables

            return variable instanceof this.variables[key]
        })

        return name ? this.convertVarName(name, false) : undefined
    }
}
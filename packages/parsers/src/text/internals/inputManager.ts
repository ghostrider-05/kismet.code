import { SequenceItemType, SequenceVariable, ISingleStore } from "@kismet.ts/core"
import { constructItem } from "@kismet.ts/shared"

export class InputTextManager {
    constructor (
        public items: SequenceItemType[],
        public variables: ISingleStore,
    ) {

    }

    private isIntegerVar (name: string) {
        const integerNames = ['Int', 'Integer']
        return integerNames.some(i => i.toLowerCase() === name.toLowerCase())
    }

    private getVariableNameForPropertyAction (name: string) {
        return this.isIntegerVar(name) ? 'Int' : name
    }

    private findVariableForName (name: string) {
        if (this.isIntegerVar(name)) return 'Integer'
        else return this.getNames()
            .find(n => n.toLowerCase() === name.toLowerCase())
    }

    public getNames (toLowerCase?: boolean): string[] {
        const names = Object.keys(this.variables)

        return toLowerCase ? names.map(n => n.toLowerCase()) : names
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
        if (!name) throw new Error('No name given to search for variables')

        const vName = this.findVariableForName(name)
        if (!vName) throw new Error('Unknown property variable: ' + name)

        const variable = this.variables[vName]
        if (!variable) throw new Error('No variable found for name: ' + name)

        return constructItem(variable)
    }

    public findVariableType (variable: SequenceVariable): string | undefined {
        const name = Object.keys(this.variables).find(_key => {
            const key = _key as keyof typeof this.variables

            return variable instanceof this.variables[key]
        })

        return name ? this.getVariableNameForPropertyAction(name) : undefined
    }
}
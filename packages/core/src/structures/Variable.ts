import { Constants, quote } from '@kismet.ts/shared'

import { BaseSequenceItem, BaseKismetItemOptions } from '../item/index.js'

import type { KismetVariableOptions } from './options.js'

export class SequenceVariable extends BaseSequenceItem {
    public variableName: string | null

    constructor (options: KismetVariableOptions & BaseKismetItemOptions) {
        super({ ...options, type: Constants.NodeType.VARIABLES })

        this.variableName = options?.name ?? null
    }

    public setName (name: string): this {
        this.variableName = name

        return this
    }

    public override toString (): string {
        return this.setProperty({ 
                name: 'VarName',
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                value: quote(this.variableName!)
            })
            .toString()
    }
}

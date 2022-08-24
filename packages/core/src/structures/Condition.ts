import { SequenceAction } from './Action.js'

import type { BaseKismetItemOptions } from '../item/options.js'
import type { KismetActionRequiredOptions } from './options.js'

export class SequenceCondition extends SequenceAction {
    constructor (options: KismetActionRequiredOptions & BaseKismetItemOptions) {
        super({
            ...options,
            isCondition: true,
        })
    }
}

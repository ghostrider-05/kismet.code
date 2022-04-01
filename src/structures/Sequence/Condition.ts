import { SequenceAction } from './Action.js'

import type {
    BaseKismetItemOptions,
    KismetActionRequiredOptions
} from '../../types/index.js'

export class SequenceCondition extends SequenceAction {
    constructor (options: KismetActionRequiredOptions & BaseKismetItemOptions) {
        super({
            ...options,
            isCondition: true
        })
    }
}

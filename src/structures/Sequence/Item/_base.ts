import { 
    SequenceAction, 
    Sequence, 
    SequenceCondition, 
    SequenceEvent, 
    SequenceVariable 
} from "../index.js"

import { 
    Constants 
} from "../../../shared/index.js"

import type { 
    SequenceItemTypeName 
} from "../../../types/index.js"

const { NodeType } = Constants

export class BaseItem {
    public readonly type: SequenceItemTypeName | null

    constructor (type?: SequenceItemTypeName) {
        this.type = type ?? null
    }

    private _checkType (compareType: Constants.NodeType) {
        return this.type === compareType
    }

    public isAction (): this is SequenceAction {
        return this._checkType(NodeType.ACTIONS)
    }

    public isCondition (): this is SequenceCondition {
        return this._checkType(NodeType.CONDITIONS)
    }

    public isEvent (): this is SequenceEvent {
        return this._checkType(NodeType.EVENTS)
    }

    public isSequence (): this is Sequence {
        return this._checkType(NodeType.SEQUENCES)
    }

    public isVariable (): this is SequenceVariable {
        return this._checkType(NodeType.VARIABLES)
    }
}
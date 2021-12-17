import { 
    Constants 
} from '../../shared/index.js'

import type { 
    layoutOptions,
    PositionStyleOptions,
    SchemaItemNames,
    SequenceItemType,
    SequencePositionManagerOptions,
    SequenceSchemaOptions
} from '../../types/index.js'
import { Sequence } from '../index.js'

const { NodeType, PositionStyleOption } = Constants

export class SequencePositionManager {
    public readonly style: PositionStyleOptions
    public options: Required<layoutOptions>
    public schema?: SequenceSchemaOptions<SchemaItemNames>[]

    constructor (options: SequencePositionManagerOptions<SchemaItemNames>) {
        const { layoutOptions, style, schema } = options

        this.style = style ?? PositionStyleOption.DEFAULT
        this.options = layoutOptions
        this.schema = schema
    }

    public fillPositions (sequence: Sequence): Sequence {
        const sequenceItems = sequence['items']
        const itemCount = sequenceItems.length

        if (itemCount === 0) {
            console.log(`Sequence '${sequence.name}' is empty`)

            return sequence
        } else if (this.style === PositionStyleOption.NONE) {
            console.log('No positions were set for sequence:' + sequence.name)

            return sequence
        }

        const { spaceBetween, startX, startY } = this.options

        for (let i = 0; i < itemCount; i++) {
            const item = sequenceItems[i]

            const { type } = item

            let position: [number, number] = [0, 0];

            switch (type) {
                case NodeType.ACTIONS || NodeType.CONDITIONS:
                case NodeType.EVENTS:
                case NodeType.VARIABLES:
                    // do something
                    position  = [startX, startY]
                    break
                case NodeType.SEQUENCES:
                    // handle subsequences
            }

            if (item.type !== NodeType.SEQUENCES) {
                (sequence['items'][i] as SequenceItemType)['kismet']['x'] = position[0];
                (sequence['items'][i] as SequenceItemType)['kismet']['x'] = position[1];
            }
        }

        return sequence
    }
}
import type { 
    layoutOptions,
    PositionStyle,
    SequenceItemType,
    SequenceItemTypeName,
    SequencePositionManagerOptions
} from '../../types/index.js'

export class SequencePositionManager {
    private items: {
        blocks: SequenceItemType[],
        events: SequenceItemType[],
        variables: SequenceItemType[]
    } = {
        blocks: [],
        events: [],
        variables: []
    }

    public readonly style: PositionStyle
    public options: Required<layoutOptions>

    constructor (options: SequencePositionManagerOptions) {
        const { layoutOptions, style } = options

        this.style = style ?? 'default'
        this.options = layoutOptions
    }

    private pushItem (type: SequenceItemTypeName | null, item: SequenceItemType) {
        switch (type) {
            case 'events':
                this.items.events.push(item)
                break
            case 'actions' || 'conditions':
                this.items.blocks.push(item)
                break
            case 'variables':
                this.items.variables.push(item)
                break
        }
    }

    public addItem (item: SequenceItemType): [number, number] {
        this.pushItem(item.type, item)

        const { type } = item

        const { spaceBetween, startX, startY } = this.options
        const { events, blocks, variables } = this.items

        const blockOffset = [spaceBetween, spaceBetween]

        if (type === 'events' && events.length === 1) {
            return [startX, startY]
        } else if (type === 'events') {
            return [startX, startY + 3 * spaceBetween]
        } else if (type === 'actions' && events.length === 1) {
            return [startX + blockOffset[0], startY + blockOffset[1]]
        } else if (type === 'actions') {
            return [startX + blockOffset[0], startY + blockOffset[1]]
        } else {
            return [startX + variables.length * 0.4 * spaceBetween, startY * 5]
        }
    }
}
import { Constants } from '../../../shared/index.js'

export const getIcon = (
    type: typeof Constants.NodeType[keyof typeof Constants.NodeType]
) => {
    let icon = ''

    switch (type) {
        case Constants.NodeType.ACTIONS:
        case Constants.NodeType.CONDITIONS:
            icon = 'NODETREE'
            break
        case Constants.NodeType.EVENTS:
            icon = 'OUTLINER'
    }

    return icon
}

export const linkIcon = (type: string) => {
    switch (type) {
        case Constants.ConnectionType.OUTPUT:
            return 'CIRCLE_DOT'
        case Constants.ConnectionType.VARIABLE:
            return 'SQUARE'
        default:
            return 'CIRCLE'
    }
}

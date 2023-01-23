import { SequenceItemType } from '@kismet.ts/core'
import { SKRSContext2D } from '@napi-rs/canvas'

interface NodeSizeOptions {
    padding: {
        name: number;
        variables: number;
        input: number;
        space: number;
    }
    nameHeight: number;
}

export function displayName (item: SequenceItemType) {
    return item.name.split('_')[1]?.match(/[A-Z][a-z]+/g)?.join(' ') ?? item.ClassData.Class
}

export function calculateNodeSize (item: SequenceItemType, ctx: SKRSContext2D, options: NodeSizeOptions) {
    const { padding, nameHeight } = options

    const width = (input: string) => ctx.measureText(input).width
    const calcHeight = (input: string) => {
        const { fontBoundingBoxAscent, fontBoundingBoxDescent } = ctx.measureText(input)
        return fontBoundingBoxAscent + fontBoundingBoxDescent
    }

    const nameSize = width(displayName(item)) + 2 * padding.name
    const variablesSize = padding.variables + item.connections.variable.reduce((size, connection) => size + padding.variables + width(connection.name), 0) + padding.variables

    const textWidth = Math.max(...item.connections.input.map(c => width(c.name))) + padding.variables + Math.max(...item.connections.output.map(c => width(c.name)))
    const height = (key: 'input' | 'output') => padding.input + item.connections[key].reduce((size, connection) => size + padding.input + calcHeight(connection.name), 0) + padding.input
    
    return {
        x: Math.max(nameSize, variablesSize, textWidth * 1.1, 100),
        y: nameHeight + padding.space + Math.max(height('input'), height('output')) - (item.connections.variable.filter(n => !n.bHidden).length === 0 ? 1.5 * nameHeight : 0.75 * nameHeight)
    }
}
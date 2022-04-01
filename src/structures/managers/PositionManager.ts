import { ProcessId, ProcessManager } from './ProcessManager.js'
import { Sequence } from '../Sequence/index.js'

import { Constants } from '../../shared/index.js'

import type {
    KismetPosition,
    layoutOptions,
    PositionStyleOptions,
    SchemaItemNames,
    SequenceItemType,
    SequencePositionManagerOptions,
    SequenceSchemaOptions,
    SequenceSchemaVariableOptions
} from '../../types/index.js'

const { PositionStyleOption, VariablePositionStyleOption } = Constants

type KismetItemPosition = { id: string } & KismetPosition

export class SequencePositionManager {
    public readonly style: PositionStyleOptions
    public readonly projectId?: ProcessId

    public options: Required<layoutOptions>
    public schema?: SequenceSchemaOptions<SchemaItemNames>[]

    constructor (options: SequencePositionManagerOptions<SchemaItemNames>) {
        const { layoutOptions, style, schema, projectId } = options

        this.style = style ?? PositionStyleOption.NONE
        this.projectId = projectId
        this.options = layoutOptions
        this.schema = schema
    }

    private _validateOptions (sequence: Sequence): Sequence | null {
        const sequenceItems = sequence['items']
        const itemCount = sequenceItems.length

        if (itemCount === 0) {
            ProcessManager.debug(
                `Sequence '${sequence.name}' is empty`,
                this.projectId
            )

            return sequence
        } else if (this.style === PositionStyleOption.NONE) {
            ProcessManager.debug(
                'No positions were set for sequence:' + sequence.name,
                this.projectId
            )

            return sequence
        }

        return null
    }

    private variablePositions (
        item: SequenceItemType,
        items: Sequence['items'],
        positions: KismetItemPosition[],
        options: SequenceSchemaVariableOptions
    ) {
        const { style, itemClass } = options
        const output: KismetItemPosition[] = []

        const connectedVars = item.connections?.variable.flatMap(n => {
            return n.linkedIds.filter(n => !positions.some(k => k.id === n))
        })
        if (
            !connectedVars ||
            connectedVars.length === 0 ||
            item['kismet'].class !== itemClass
        )
            return []

        const Vars = items.filter(n => {
            return connectedVars.includes(n.linkId)
        })

        Vars.forEach((Var, i) => {
            // skip inherit positions
            if (style === VariablePositionStyleOption.ATTACH) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const itemPos = positions.find(x => x.id === item.linkId)!

                output.push({
                    id: Var.linkId,
                    x: itemPos.x + i * 200,
                    y: itemPos.y - 200
                })
            } else if (
                style === VariablePositionStyleOption.GLOBAL &&
                options.globalOptions
            ) {
                const { bounds } = options.globalOptions

                const width = bounds[2] - bounds[0],
                    height = bounds[3] - bounds[1],
                    ratio = width / height

                const position = {
                    x: bounds[0] + ratio * (i % (Vars.length - 1)),
                    y: bounds[1] + (1 / ratio) * (i % (Vars.length - 1))
                }

                output.push({ ...position, id: Var.linkId })
            }
        })

        return output
    }

    protected applySchema (
        sequence: Sequence,
        schema?: SequenceSchemaOptions<SchemaItemNames>
    ): KismetItemPosition[] {
        if (!schema) return []

        const items = schema.event
            ? sequence.listConnectedItems(
                  schema.event.id,
                  schema.event.connectionName
              )
            : sequence['items'].map(n => n.linkId)
        if (items.length === 0) return []

        return schema.layout.flatMap(layout => {
            return this.applyStyle(
                items.map(n => sequence.resolveId(n) as SequenceItemType),
                layout
            )
        })
    }

    protected applyStyle (
        inputItems: Sequence['items'],
        layout: SequenceSchemaOptions<SchemaItemNames>['layout'][0]
    ): KismetItemPosition[] {
        const output: KismetItemPosition[] = []
        const { options, style, type, variables } = layout

        let lastPosition: KismetPosition = {
            x: options.startX,
            y: options.startY
        }
        const multipliers: KismetPosition = {
            x: style === PositionStyleOption.GRID ? 1 : 0.75,
            y: style === PositionStyleOption.WATERFALL ? -1 : 1
        }

        const items = type
            ? inputItems.filter(n => {
                  return type === 'actions'
                      ? n.isAction()
                      : type === 'variables'
                      ? n.isVariable()
                      : false
              })
            : inputItems

        for (const item of items) {
            if (item.isSequence()) {
                item['items'] =
                    item['positionManager'].fillPositions(item)['items']
            } else if (item.isSequenceItem()) {
                const newPosition = {
                    x: lastPosition.x + multipliers.x * options.spaceBetween,
                    y: lastPosition.y + multipliers.y * options.spaceBetween
                }

                lastPosition = newPosition

                if (variables) {
                    variables.forEach(Var => {
                        output.push(
                            ...this.variablePositions(item, items, output, Var)
                        )
                    })
                }

                output.push({ ...newPosition, id: item.linkId })
            }
        }

        return output
    }

    public fillPositions (sequence: Sequence): Sequence {
        const sequenceItems = sequence['items']

        const returnSequence = this._validateOptions(sequence)
        if (returnSequence) return returnSequence

        let positions: KismetItemPosition[] = []

        if (!this.schema) {
            if (this.style !== PositionStyleOption.NONE)
                positions = this.applyStyle(sequenceItems, {
                    style: this.style,
                    options: this.options
                })
        } else {
            for (const schema of this.schema) {
                positions.push(...this.applySchema(sequence, schema))
            }
        }

        positions.forEach(pos => {
            const idIndex = sequence.indexOf(pos.id)
            ;(sequence['items'][idIndex] as SequenceItemType)?.setPosition(pos)
        })

        return sequence
    }
}

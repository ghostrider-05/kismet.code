import { KismetPosition, SequenceEvent, SequenceItemType } from '@kismet.ts/core';
import { createCanvas, Canvas, SKRSContext2D } from '@napi-rs/canvas'
import { writeFile } from 'fs/promises';

import { calculateNodeSize, displayName } from '../node/index.js';

import { FontCanvas } from './font.js';

export type DrawCommand = (ctx: SKRSContext2D) => void

export type KismetSingleItemPosition = KismetPosition | { x: 'center'; y: number }

export class SequenceCanvas {
    public canvas: Canvas;

    public colors = {
        bg: '#8F8F8F',
        shadow: '#000000',
        variableSocket: '#D51DD5',
        inputSocket: '#000000',
        comment: '#7878FF',
        variables: {
            Bool: '#D51D1D',
            Int: '#1DD5D5',
            String: '#1DD51D',
            Float: '#1D1DD5',
            Vector: ''
        }
    }

    constructor (width: number, height: number, private adjustCanvas?: { padding: number }) {
        this.canvas = createCanvas(width, height)
    }

    public fonts = new FontCanvas()

    public get ctx () {
        return this.canvas.getContext('2d')
    }

    public draw (...cmd: DrawCommand[]): this {
        cmd.forEach(command => command(this.ctx))

        return this
    }

    private setColor (color: string, style?: 'stroke'): void {
        this.draw((ctx) => ctx[`${style ?? 'fill'}Style`] = color)
    }

    public drawNodeSocket (location: KismetPosition, size: number, options: { color: 'black' | 'purple', output?: boolean }): this {
        this.setColor(options.color)

        const commands: DrawCommand[] = [
            (ctx) => { ctx.fillRect(location.x, location.y, size, size) }
        ]

        this.draw(...commands);

        return this
    }

    public drawTriangle (x: number, y: number, w: number, h: number) {
        this.ctx.beginPath()

        this.ctx.moveTo(x, y)
        this.ctx.lineTo(x + w, y)
        this.ctx.lineTo(x + w / 2, y + h)
        this.ctx.fill()
    }

    public fillTextWithShadow (text: string, shadow: string, x: number, y: number, offsetX: number, offsetY?: number, blur?: number) {
        this.ctx.shadowOffsetX = offsetX;
        this.ctx.shadowOffsetY = offsetY ?? offsetX;
        this.ctx.shadowBlur = blur ?? 1;
        this.ctx.shadowColor = shadow;

        this.ctx.fillText(text, x, y)

        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    public drawActionNode (location: KismetSingleItemPosition, item: SequenceItemType): void {
        const nameHeight = 25, varPadding = 10;
        this.ctx.lineWidth = 1;
        this.ctx.font = '100 16px Arial'

        const { x, y } = calculateNodeSize(item, this.ctx, {
            padding: {
                space: 4,
                variables: 10,
                input: 10,
                name: 20
            },
            nameHeight: 25
        })

        if (this.adjustCanvas && y > this.canvas.height) {
            this.canvas.height = y + this.adjustCanvas.padding
        }

        const leftX = location.x === 'center' ? (this.canvas.width - x) / 2 : location.x

        this.ctx.fillStyle = this.colors.bg
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#FFFF00'

        this.ctx.strokeRect(leftX, location.y, x, nameHeight);
        this.ctx.fillStyle = '#707070';
        this.ctx.fillRect(leftX, location.y, x, nameHeight);
        this.ctx.fillStyle = '#FFFF80';

        this.ctx.fillStyle = '#FFFF80'
        const name = displayName(item)
        this.fillTextWithShadow(name, '#000000', leftX + ((x - this.ctx.measureText(name).width) / 2), (location.y) + nameHeight * 0.5 + (nameHeight - this.fonts.getHeight(name, this.ctx).font) / 2, 1)

        this.ctx.strokeStyle = '#FFFF00'
        this.ctx.strokeRect(leftX, location.y + 3 + nameHeight, x, y);

        if (item.commentOptions.comment) {
            this.ctx.fillStyle = this.colors.comment
            this.fillTextWithShadow(item.commentOptions.comment, this.colors.shadow, leftX, location.y - 8, -1)
        }

        const inputs = item.connections.input.filter(n => !n.bHidden)
        const outputs = item.connections.output.filter(n => !n.bHidden)
        const variables = item.connections.variable.filter(n => !n.bHidden)

        for (let i = 0; i < inputs.length; i++) {
            this.ctx.fillStyle = '#FFFFFF'
            this.fillTextWithShadow(inputs[i].name, this.colors.shadow, leftX + 5, 2 * varPadding + i * (3 * varPadding) + location.y + 5 + nameHeight, 1)

            this.ctx.fillStyle = this.colors.inputSocket
            this.ctx.fillRect(leftX - 9, 12 + i * 30 + location.y + 5 + nameHeight, 8, 6)
        }

        for (let i = 0; i < outputs.length; i++) {
            this.ctx.fillStyle = '#FFFFFF'
            this.fillTextWithShadow(outputs[i].name, this.colors.shadow, leftX + x - this.ctx.measureText(outputs[i].name).width - 5, 2 * varPadding + i * (3 * varPadding) + location.y + 5 + nameHeight, 1)

            this.ctx.fillStyle = this.colors.inputSocket
            this.ctx.fillRect(leftX + x + 1, 12 + i * 30 + location.y + 5 + nameHeight, 8, 6)
        }

        if (variables.length === 1) {
            this.ctx.fillStyle = '#FFFFFF'
            this.fillTextWithShadow(variables[0].name, this.colors.shadow, leftX + x / 2 - (this.ctx.measureText(variables[0].name).width / 2), location.y + 5 + nameHeight + y - this.fonts.getHeight(variables[0].name, this.ctx).font, 1)

            this.ctx.fillStyle = this.colors.variableSocket
            this.ctx.fillRect(leftX + x / 2 - 3, y + location.y + 4 + nameHeight, 6, 8)
        } else  {
            let w = 10;
            for (let i = 0; i < variables.length; i++) {
                this.ctx.fillStyle = '#FFFFFF'
                this.fillTextWithShadow(variables[i].name, this.colors.shadow, leftX + w, location.y + 1.5 * nameHeight + y - this.fonts.getHeight(variables[i].name, this.ctx).font, 1)
    
                w += this.ctx.measureText(variables[i].name).width + 10;
            
                const type: string | undefined = variables[i].expectedType.replace(/'/g, '').split('_')[1]
                this.ctx.fillStyle = (type ? this.colors.variables[<never>type] : undefined) ?? this.colors.variableSocket
                
                const varX = leftX + w - 10 - (this.ctx.measureText(variables[i].name).width / 2), 
                    varY = y + location.y + 4 + nameHeight

                if (variables[i].isOutput()) {
                    this.drawTriangle(varX, varY, 8, 10)
                } else {
                    this.ctx.fillRect(varX, varY, 6, 8)
                }
            }
        }
    }

    public drawEventNode (location: KismetSingleItemPosition, event: SequenceEvent) {
        this.drawActionNode(location, event)
    }

    public toBuffer (useData = false) {
        return useData ? this.canvas.data() : this.canvas.toBuffer('image/png')
    }

    public async save (path: string, format: 'png' | 'webp' | 'jpeg' = 'png') {
        const buffer = await this.canvas.encode(<'png'>format)
        await writeFile(path, buffer)
    }
}
import { BaseSequenceItem } from "./Item/index.js";
import { KismetColor } from "./misc/index.js";

import { 
    addVariable, 
    boolToKismet 
} from "../../shared/index.js";

import { 
    KismetVariableInternalType 
} from "../../types/index.js";

const DEFAULT_COMMENT_FRAME_SIZE_X = 248
const DEFAULT_COMMENT_FRAME_SIZE_Y = 184

const DEFAULT_BORDER_WIDTH = 1

export class Comment extends BaseSequenceItem {
    public size: { x: number; y: number; };
    public drawBox: boolean;
    public filled: boolean;
    public tileFill: boolean;
    public borderColor: KismetColor;
    public borderWidth: number;
    public fillColor: KismetColor;
    public fillMaterial: string | null;
    public fillTexture: string | null;

    constructor (comment?: string) {
        super({
            ObjectArchetype: `SequenceFrame'Engine.Default__SequenceFrame'`,
            inputs: {}
        })

        this.comment = comment ?? 'Comment'

        this.size = {
            x: 128,
            y: 64
        }

        this.drawBox = false
        this.filled = false
        this.tileFill = false

        this.borderColor = new KismetColor()
            .setColors([0, 0, 0, 255])
        this.borderWidth = DEFAULT_BORDER_WIDTH

        this.fillColor = new KismetColor()
            .setColors([255, 255, 255, 16])
        this.fillMaterial = null
        this.fillTexture = null
    }

    public isCommentFrame (): boolean {
        return this.drawBox
    }
 
    public setBorder (options?: { width?: number, color?: KismetColor }): this {
        if (options) {
            if ('width' in options) {
                this.borderWidth = (options.width ?? this.borderWidth)
            }

            if ('color' in options) {
                this.borderColor = (options.color ?? this.borderColor)
            }
        }

        this.drawBox = true

        return this
    }

    public setFilled (options?: { 
        tileFill?: boolean, 
        color?: KismetColor, 
        material?: string, 
        texture?: string
    }): this {
        if (options) {
            if ('tileFill' in options) {
                this.tileFill = (options.tileFill ?? this.tileFill)
            }

            if ('color' in options) {
                this.fillColor = (options.color ?? this.fillColor)
            }

            if ('material' in options) {
                this.fillMaterial = (options.material ?? this.fillMaterial)
            }

            if ('texture' in options) {
                this.fillTexture = (options.texture ?? this.fillTexture)
            }
        }

        this.filled = true

        return this
    }

    public setStyle (style: 'default'): this {
        switch (style) {
            case 'default': {
                this.fillTexture = null
                this.fillMaterial = null

                const blackColor = new KismetColor()
                    .setColors([0, 0, 0, 255])

                this.borderColor = blackColor
                this.fillColor = blackColor

                this.borderWidth = DEFAULT_BORDER_WIDTH

                this.drawBox = this.isCommentFrame()
                this.filled = this.isCommentFrame()
                this.tileFill = false

                break;
            }

            default:
                throw new Error('Unexpected style')
        }

        return this
    }

    public override toKismet (): string {
        const kismet = super.toKismet()

        const variables: [string, KismetVariableInternalType][] = [
            ['SizeX', this.size.x],
            ['SizeY', this.size.y],
            ['BorderWidth', this.borderWidth],
            ['bDrawBox', boolToKismet(this.drawBox)],
            ['bFilled', boolToKismet(this.filled)],
            ['bTileFill', boolToKismet(this.tileFill)],
            ['BorderColor', this.borderColor.toString()],
            ['FillColor', this.fillColor.toString()],
            ['FillMaterial', this.fillMaterial ?? ''],
            ['FillTexture', this.fillTexture ?? '']
        ]

        return addVariable(kismet, variables)
    }
}

export class CommentFrame extends Comment {
    constructor (comment?: string) {
        super(comment)

        this.size.x = DEFAULT_COMMENT_FRAME_SIZE_X
        this.size.y = DEFAULT_COMMENT_FRAME_SIZE_Y

        this.filled = true
        this.drawBox = true
    }
}
import { GlobalFonts, SKRSContext2D } from '@napi-rs/canvas'

export class FontCanvas {
    public registerFont (path: string, name?: string): boolean {
        return GlobalFonts.registerFromPath(path, name)
    }

    public get families () {
        return GlobalFonts.families as Readonly<typeof GlobalFonts.families>
    }

    public getHeight (text: string, ctx: SKRSContext2D) {
        const { 
            fontBoundingBoxAscent, 
            fontBoundingBoxDescent, 
            actualBoundingBoxAscent, 
            actualBoundingBoxDescent 
        } = ctx.measureText(text)
        
        return {
            actual: actualBoundingBoxAscent + actualBoundingBoxDescent,
            font: fontBoundingBoxAscent + fontBoundingBoxDescent
        }
    }

    public getWidth (text: string, ctx: SKRSContext2D) {
        return ctx.measureText(text).width
    }
}

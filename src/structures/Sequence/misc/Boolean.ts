import { Constants, KismetError } from '../../../shared/index.js'

export type KismetBooleanCodeValue = boolean | 0 | 1

export class KismetBoolean {
    public value: KismetBooleanCodeValue

    constructor (value: KismetBooleanCodeValue) {
        this.value = value
    }

    public get kismet (): string {
        return this.value
            ? Constants.KismetBoolean.True
            : Constants.KismetBoolean.False
    }

    public static toCode (value: string): boolean {
        const code =
            value === Constants.KismetBoolean.True
                ? true
                : value === Constants.KismetBoolean.False
                ? false
                : undefined

        if (code == undefined)
            new KismetError('INVALID_TYPE', [
                value,
                'kismet string of a boolean',
            ])

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return code!
    }

    public static toKismet (value: KismetBooleanCodeValue): string {
        return new KismetBoolean(value).kismet
    }
}

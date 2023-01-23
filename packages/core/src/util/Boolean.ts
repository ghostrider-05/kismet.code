import { Constants, KismetError } from '@kismet.ts/shared'

export type KismetBooleanCodeValue = boolean | 0 | 1

export class KismetBoolean {
    public value: KismetBooleanCodeValue

    constructor (value: KismetBooleanCodeValue) {
        this.value = value
    }

    public get kismet (): string {
        return KismetBoolean.toKismet(this.value)
    }

    public static toCode (value: string, silent = false): boolean {
        const code =
            value === Constants.KismetBoolean.True
                ? true
                : value === Constants.KismetBoolean.False
                ? false
                : undefined

        if (code == undefined && !silent)
            new KismetError('INVALID_TYPE', [
                value,
                'kismet string of a boolean',
            ])

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return code!
    }

    public static toKismet (value: KismetBooleanCodeValue): string {
        return value
            ? Constants.KismetBoolean.True
            : Constants.KismetBoolean.False
    }
}

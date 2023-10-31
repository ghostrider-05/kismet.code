import { Sequence, SequenceItemType } from "@kismet.ts/core";
import { If } from "@kismet.ts/shared";

import { TextNodeParser } from "./node.js";
import type { 
    TextParserOptions, 
    TextSequenceParserOptions,
} from "./options.js";
import { TextSequenceParser } from "./sequence.js";


export type KismetParseResult<T extends boolean = false> = 
    | { success: true, message: If<T, string, Sequence | SequenceItemType>, error: undefined }
    | { success: false, message: undefined, error: undefined }
    | { success: false, message: undefined, error: string }

export class TextKismetParser<T extends boolean = false> {
    public node: TextNodeParser<T>;
    public sequence: TextSequenceParser<T>;

    public constructor (
        items: SequenceItemType[],
        node: TextParserOptions<T>,
        sequence: TextSequenceParserOptions<T>,
    ) {
        this.node = new TextNodeParser(items, node);
        this.sequence = new TextSequenceParser(items, sequence);
    }

    public parse (input: string): KismetParseResult<T> {
        try {
            const result = this.node.parse(input) 
                ?? this.sequence.parse(input)

            return result != undefined 
                ? {
                    message: result,
                    success: true,
                    error: undefined,
                } 
                : { 
                    success: false,
                    message: undefined,
                    error: undefined ,
                }
        } catch (err) {
            return {
                message: undefined,
                success: false,
                error: err instanceof Error 
                    ? err.message
                    : JSON.stringify(err),
            }
        }
    }

    public parseMessages (inputs: string[]) {
        const results = inputs.map(i => this.parse(i))

        return {
            success: results.every(r => r.success),
            errors: results.map(r => r.error).filter((e): e is string => e != undefined),
            results: results.map(r => r.message).filter((e): e is NonNullable<typeof e> => e != undefined),
        }
    }
}
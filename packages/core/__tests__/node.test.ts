import { describe, expect, it } from 'vitest';

import { Constants } from '@kismet.ts/shared';
import { builders } from "./builders/index.js";

const { util: { rawKeys, hasRawValue } } = builders

describe('Sequence node', () => {
    it('breakpoint', () => {
        const node = builders.nodeBuilder();

        expect(node.hasBreakpoint).toBeFalsy();
        expect(node.setBreakpoint(true).hasBreakpoint).toBeTruthy();
        expect(hasRawValue(node.toJSON(), rawKeys.breakpoint, Constants.KismetBoolean.True)).toBeTruthy();
        expect(node.setBreakpoint(false).hasBreakpoint).toBeFalsy();
        expect(hasRawValue(node.toJSON(), rawKeys.breakpoint, Constants.KismetBoolean.False)).toBeTruthy();
    })
})
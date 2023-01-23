import { describe, expect, it } from 'vitest';

import { kismetSequence } from './input.js';
import { node } from './parsers.js';

describe('raw kismet input', () => {
    it('single node input', () => {
        const text = 'Begin' + kismetSequence.split('\nBegin')[1];

        const item = node.parseRawNode(text);
        expect(item).toBeDefined()
        expect(item).toHaveProperty('name', 'SeqAct_GetProperty')
    })
})
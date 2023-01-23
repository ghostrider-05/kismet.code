import { Sequence } from '@kismet.ts/core'
import { describe, expect, it } from 'vitest'
import { TextSequenceParser } from '../../src/index.js'

import { kismetSequence } from './input.js'
import { sequence } from './parsers.js'

describe('sequence input: regex', () => {
  it('valid inputs', () => {
    expect(sequence.isSequenceInput('A -> B')).toBeTruthy()
    expect(sequence.isSequenceInput('A -> B -> C > D')).toBeTruthy()
    expect(sequence.isSequenceInput('A > B')).toBeTruthy()
  })

  it('invalid inputs', () => {
    expect(sequence.isSequenceInput('A')).toBeFalsy()
  })
})

describe('sequence input: string', () => {
  it('valid inputs', () => {
    TextSequenceParser.splitChar = '>'
    expect(sequence.isSequenceInput('A -> B')).toBeTruthy()
    expect(sequence.isSequenceInput('A -> B -> C > D')).toBeTruthy()
    expect(sequence.isSequenceInput('A > B')).toBeTruthy()
  })

  it('invalid inputs', () => {
    expect(sequence.isSequenceInput('A')).toBeFalsy()
  })
})

describe('sequence property chain', () => {
  function findVariable (sequence: Sequence | undefined, type: string) {
    const item =  sequence?.items.find(i => {
      return i.isVariable() && i.ClassData.Class.includes(type)
    })

    return item?.isVariable() ? item : undefined
  }

  it('invalid input', () => {
    expect(sequence.parsePropertyChain('Player()-A')).toBeUndefined()
    expect(sequence.parsePropertyChain('Player()')).toBeUndefined()
    expect(sequence.parsePropertyChain('A')).toBeUndefined()
  })

  it('invalid base property', () => {
    expect(() => sequence.parsePropertyChain('Player.A')).toThrowError()
    expect(() => sequence.parsePropertyChain('player().A')).toThrowError()
  })

  it('base property options', () => {
    const item = sequence.parsePropertyChain('Player(PlayerIdx=1).A')

    expect(findVariable(item, 'Player')?.raw).toEqual([['PlayerIdx', '1']])

    const item2 = sequence.parsePropertyChain('Player(PlayerIdx=1,bAllPlayers=False).A')

    expect(findVariable(item2, 'Player')?.raw).toEqual([['PlayerIdx', '1'], ['bAllPlayers', 'False']])
  })

  it('return type', () => {
    expect(findVariable(sequence.parsePropertyChain('Player().<Integer>Index'), 'Int')).toBeDefined()
    expect(findVariable(sequence.parsePropertyChain('Player().<Int>Index'), 'Int')).toBeDefined()
    expect(findVariable(sequence.parsePropertyChain('Player().A.B.<Int>Index'), 'Int')).toBeDefined()
    expect(findVariable(sequence.parsePropertyChain('Player().<Float>Index'), 'Float')).toBeDefined()
  })
})

describe('parse raw sequence', () => {
  it('reconstruct the input', () => {
    const seq = sequence.parseRawSingleSequence(kismetSequence)
    expect(seq?.toString()).toBeTypeOf('string')
  })
})
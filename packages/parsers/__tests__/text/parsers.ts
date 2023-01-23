import { TextSequenceParser, TextNodeParser } from '../../src/index.js'
import { Items, listDefaultItems } from '../../../items/dist/src/index.js'
import { constructItem, Constants } from '@kismet.ts/shared'
import { SequenceItemTypeof } from '@kismet.ts/core';

const sequenceOptions = {
  layout: {
    style: Constants.PositionStyleOption.MOUNTAIN,
    position: {
      startX: 0,
      startY: 0,
      spaceBetween: 300
    }
  }
}

export const node = new TextNodeParser(listDefaultItems().map(i => constructItem(i)), {
  convertToString: false,
  sequence: sequenceOptions
})

export const sequence = new TextSequenceParser(listDefaultItems().map(i => constructItem(i)), {
  convertToString: false,
  sequence: sequenceOptions,
  variables: { GetProperty: Items.Actions.GetProperty as SequenceItemTypeof, ...Items.Variables },

  newLinesSeperation: 1,
  extractSequenceOrder: block => {
    return [block.split(TextSequenceParser.splitChar)];
  },
  extractItem: item => {
    const [begin, connection] = item.split(':');

    const connectionName = connection?.slice(1, -1).split(','),
      itemName = begin.split('(')[0],
      rawVariables = begin.slice(itemName.length + 1, -1),
      variables = rawVariables !== '' && !rawVariables.includes('(')
        ? rawVariables
        : undefined;

    const [name, id] = itemName.includes('?')
      ? itemName.split('?')
      : [itemName, undefined];

    return {
      name,
      id,
      variables,
      inputName: connectionName?.[1].trim(),
      outputName: connectionName?.[0].trim(),
    };
  },
});
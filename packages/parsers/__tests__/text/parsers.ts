import { TextSequenceParser, TextNodeParser } from '../../src/index.js'
import { Items, listItems } from '@kismet.ts/items'
import { Constants } from '@kismet.ts/shared'

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

export const node = new TextNodeParser(listItems(), {
  convertToString: false,
  sequence: sequenceOptions
})

export const sequence = new TextSequenceParser<false>(listItems(), {
  convertToString: false,
  sequence: sequenceOptions,

  getPropertyAction: Items.Actions.GetProperty,
  variables: Items.Variables,

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
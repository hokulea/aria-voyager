import { RadioGroup } from '#src';
import { appendRadioItem, createRadioGroupElement } from '#tests/components/radio-group';

export function createRadioGroup(parent: HTMLElement, items: string[]) {
  const container = createRadioGroupElement(parent);

  for (const item of items) {
    appendRadioItem(container, item);
  }

  const radioGroup = new RadioGroup(container);

  return { container, radioGroup };
}

export function getItems(radioGroup: RadioGroup) {
  return {
    firstItem: radioGroup.items[0],
    secondItem: radioGroup.items[1],
    thirdItem: radioGroup.items[2],
    fourthItem: radioGroup.items[3],
    fifthItem: radioGroup.items[4],
    sixthItem: radioGroup.items[5],
    fourthLastItem: radioGroup.items.at(-4) as HTMLElement,
    thirdLastItem: radioGroup.items.at(-3) as HTMLElement,
    secondLastItem: radioGroup.items.at(-2) as HTMLElement,
    lastItem: radioGroup.items.at(-1) as HTMLElement
  };
}

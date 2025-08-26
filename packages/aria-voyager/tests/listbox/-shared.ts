import { appendItemToList, createListElement } from '#tests/components/list';

import type { Listbox } from '#src';

export function withMultiSelect(list: HTMLElement): HTMLElement {
  list.setAttribute('aria-multiselectable', 'true');

  return list;
}

export function withFruitItems(list: HTMLElement): HTMLElement {
  appendItemToList('Banana', list);
  appendItemToList('Apple', list);
  appendItemToList('Pear', list);

  return list;
}

export function createListWithFruits() {
  return withFruitItems(createListElement(document.body));
}

export function createMultiSelectListWithFruits() {
  return withFruitItems(withMultiSelect(createListElement(document.body)));
}

export function getItems(list: Listbox) {
  return {
    firstItem: list.items[0],
    secondItem: list.items[1],
    thirdItem: list.items[2],
    fourthItem: list.items[3],
    fifthItem: list.items[4],
    sixthItem: list.items[5],
    // ...
    fourthLastItem: list.items.at(-4) as HTMLElement,
    thirdLastItem: list.items.at(-3) as HTMLElement,
    secondLastItem: list.items.at(-2) as HTMLElement,
    lastItem: list.items.at(-1) as HTMLElement
  };
}

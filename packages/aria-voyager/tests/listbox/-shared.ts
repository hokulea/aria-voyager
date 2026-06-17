import { afterAll, beforeAll } from 'vitest';

import { Listbox } from '#src';
import { appendItemToList, createListElement } from '#tests/components/list';

import { getControlItems } from '#tests/test-support/-items';
import { setupTest } from '#tests/test-support/setup-test';

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

export type ListboxContext = {
  listbox: Listbox;
  list: HTMLElement;
  firstItem: HTMLElement;
  secondItem: HTMLElement;
  thirdItem: HTMLElement;
  fourthItem: HTMLElement;
  fifthItem: HTMLElement;
  sixthItem: HTMLElement;
  fourthLastItem: HTMLElement;
  thirdLastItem: HTMLElement;
  secondLastItem: HTMLElement;
  lastItem: HTMLElement;
};

export interface SetupListboxOptions {
  multiSelect?: boolean;
  disabled?: boolean;
  items?: string[];
}

export function setupListbox(options?: SetupListboxOptions): ListboxContext {
  setupTest();

  const ctx: Partial<ListboxContext> = {};
  const result = {} as ListboxContext;

  const properties: (keyof ListboxContext)[] = [
    'listbox',
    'list',
    'firstItem',
    'secondItem',
    'thirdItem',
    'fourthItem',
    'fifthItem',
    'sixthItem',
    'fourthLastItem',
    'thirdLastItem',
    'secondLastItem',
    'lastItem'
  ];

  for (const prop of properties) {
    Object.defineProperty(result, prop, {
      get: () => ctx[prop],
      enumerable: true
    });
  }

  beforeAll(() => {
    ctx.list = createListElement(document.body);

    if (options?.multiSelect) {
      ctx.list.setAttribute('aria-multiselectable', 'true');
    }

    if (options?.disabled) {
      ctx.list.setAttribute('aria-disabled', 'true');
    }

    const items = options?.items ?? ['Banana', 'Apple', 'Pear'];

    for (const item of items) {
      appendItemToList(item, ctx.list);
    }

    ctx.listbox = new Listbox(ctx.list);

    // Populate items
    const controlItems = getControlItems(ctx.listbox);

    Object.assign(ctx, controlItems);
  });

  afterAll(() => {
    ctx.listbox?.dispose();
  });

  return result;
}

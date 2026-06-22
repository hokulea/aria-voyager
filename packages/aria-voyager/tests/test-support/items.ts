import { expect } from 'vitest';

import type { Control } from '#src';
import type { Item } from '#src/controls/control';

export interface ControlWithItems {
  items: HTMLElement[];
}

export interface ControlItems {
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
}

export function getControlItems(control: Control): ControlItems {
  return {
    firstItem: control.items[0],
    secondItem: control.items[1],
    thirdItem: control.items[2],
    fourthItem: control.items[3],
    fifthItem: control.items[4],
    sixthItem: control.items[5],
    fourthLastItem: control.items.at(-4) as HTMLElement,
    thirdLastItem: control.items.at(-3) as HTMLElement,
    secondLastItem: control.items.at(-2) as HTMLElement,
    lastItem: control.items.at(-1) as HTMLElement
  };
}

export async function allItemsToHaveAttributeBut(
  items: Item[],
  attributeName: string,
  expectedValue: string,
  excluded: number | Item
) {
  const filteredItems = items.filter((item, idx) => {
    if (typeof excluded === 'number') {
      return idx !== excluded;
    }

    return item !== excluded;
  });

  for (const item of filteredItems) {
    await expect.element(item).toHaveAttribute(attributeName, expectedValue);
  }
}

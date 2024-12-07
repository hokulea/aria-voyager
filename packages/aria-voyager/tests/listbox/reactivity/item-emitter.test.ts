import { userEvent } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';

import { ItemEmitStrategy, Listbox } from '../../../src';
import { createListWithFruits } from '../-shared';

describe('ItemEmitter', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);

  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  const listeners = {
    select() {},
    activateItem() {}
  };

  new ItemEmitStrategy(listbox, listeners);

  test('emits selection', async () => {
    const selectSpy = vi.spyOn(listeners, 'select');

    await userEvent.click(secondItem);

    expect(selectSpy).toHaveBeenCalledWith([secondItem]);
  });

  test('emits active item', async () => {
    const activateItemSpy = vi.spyOn(listeners, 'activateItem');

    await userEvent.click(thirdItem);

    expect(activateItemSpy).toHaveBeenCalledWith(thirdItem);
  });
});

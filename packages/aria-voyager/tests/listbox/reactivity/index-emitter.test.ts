import { describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { IndexEmitStrategy, Listbox } from '#src';
import { createListWithFruits } from '#tests/listbox/-shared';

describe('IndexEmitter', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);

  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  const listeners = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    select() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activateItem() {}
  };

  new IndexEmitStrategy(listbox, listeners);

  test('emits selection', async () => {
    const selectSpy = vi.spyOn(listeners, 'select');

    await userEvent.click(secondItem);

    expect(selectSpy).toHaveBeenCalledWith([1]);
  });

  test('emits active item', async () => {
    const activateItemSpy = vi.spyOn(listeners, 'activateItem');

    await userEvent.click(thirdItem);

    expect(activateItemSpy).toHaveBeenCalledWith(2);
  });
});

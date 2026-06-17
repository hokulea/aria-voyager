import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { IndexEmitStrategy, Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

test('IndexEmitter', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { secondItem, thirdItem } = getItems(listbox);

  const listeners = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    select() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activateItem() {}
  };

  new IndexEmitStrategy(listbox, listeners);

  await annotate('emits selection');

  const selectSpy = vi.spyOn(listeners, 'select');

  await userEvent.click(secondItem);
  expect(selectSpy).toHaveBeenCalledWith([1]);

  await annotate('emits active item');

  const activateItemSpy = vi.spyOn(listeners, 'activateItem');

  await userEvent.click(thirdItem);
  expect(activateItemSpy).toHaveBeenCalledWith(2);
});

import { expect, test, vi } from 'vitest';

import { ItemEmitStrategy, Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

import { firePointer } from '#tests/test-support/events';

test('ItemEmitter', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { secondItem, thirdItem } = getItems(listbox);

  const listeners = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    select() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activateItem() {}
  };

  new ItemEmitStrategy(listbox, listeners);

  await annotate('emits selection');

  const selectSpy = vi.spyOn(listeners, 'select');

  await firePointer(secondItem);
  expect(selectSpy).toHaveBeenCalledWith([secondItem]);

  await annotate('emits active item');

  const activateItemSpy = vi.spyOn(listeners, 'activateItem');

  await firePointer(thirdItem);
  expect(activateItemSpy).toHaveBeenCalledWith(thirdItem);
});

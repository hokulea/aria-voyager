import { expect, test, vi } from 'vitest';

import { IndexEmitStrategy } from '#src';
import { createTabs, getTabItems } from '#tests/tablist/-shared';

import { firePointer } from '#tests/test-support/events';

test('IndexEmitter', async ({ annotate }) => {
  const { tabs } = createTabs();
  const { secondItem, thirdItem } = getTabItems(tabs);

  const listeners = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    select() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activateItem() {}
  };

  new IndexEmitStrategy(tabs, listeners);

  await annotate('emits selection');

  const selectSpy = vi.spyOn(listeners, 'select');

  await firePointer(secondItem);

  expect(selectSpy).toHaveBeenCalledWith([1]);

  await annotate('emits active item');

  const activateItemSpy = vi.spyOn(listeners, 'activateItem');

  await firePointer(thirdItem);

  expect(activateItemSpy).toHaveBeenCalledWith(2);
});

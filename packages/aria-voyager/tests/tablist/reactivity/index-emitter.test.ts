import { userEvent } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';

import { IndexEmitStrategy } from '../../../src';
import { createTabs, getTabItems } from '../-shared';

describe('IndexEmitter', () => {
  const { tabs } = createTabs();
  const { secondItem, thirdItem } = getTabItems(tabs);

  const listeners = {
    select() {},
    activateItem() {}
  };

  new IndexEmitStrategy(tabs, listeners);

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

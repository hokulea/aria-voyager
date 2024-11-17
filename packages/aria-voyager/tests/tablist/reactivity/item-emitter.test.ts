import { userEvent } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';

import { ItemEmitStrategy } from '../../../src';
import { createTabs, getTabItems } from '../-shared';

describe('ItemEmitter', () => {
  const { tabs } = createTabs();
  const { secondItem, thirdItem } = getTabItems(tabs);

  const listeners = {
    select() {},
    activateItem() {}
  };

  new ItemEmitStrategy(tabs, listeners);

  test('emits selection', async () => {
    const selectSpy = vi.spyOn(listeners, 'select');

    await userEvent.click(secondItem);

    expect(selectSpy).toHaveBeenCalledWith([secondItem]);
  });

  test('emits active item', () => {
    const activateItemSpy = vi.spyOn(listeners, 'activateItem');

    thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    expect(activateItemSpy).toHaveBeenCalledWith(thirdItem);
  });
});

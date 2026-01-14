import { describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { ItemEmitStrategy } from '#src';
import { createTabs, getTabItems } from '#tests/tablist/-shared';

describe('ItemEmitter', () => {
  const { tabs } = createTabs();
  const { secondItem, thirdItem } = getTabItems(tabs);

  const listeners = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    select() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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

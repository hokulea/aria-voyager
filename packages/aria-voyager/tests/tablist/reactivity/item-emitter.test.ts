import { beforeAll, describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { ItemEmitStrategy } from '#src';
import { setupTabs } from '#tests/tablist/-shared';

describe('ItemEmitter', () => {
  const ctx = setupTabs();

  const listeners = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    select() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activateItem() {}
  };

  beforeAll(() => {
    new ItemEmitStrategy(ctx.tabs, listeners);
  });

  test('emits selection', async () => {
    const selectSpy = vi.spyOn(listeners, 'select');

    await userEvent.click(ctx.secondItem);

    expect(selectSpy).toHaveBeenCalledWith([ctx.secondItem]);
  });

  test('emits active item', () => {
    const activateItemSpy = vi.spyOn(listeners, 'activateItem');

    ctx.thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    expect(activateItemSpy).toHaveBeenCalledWith(ctx.thirdItem);
  });
});

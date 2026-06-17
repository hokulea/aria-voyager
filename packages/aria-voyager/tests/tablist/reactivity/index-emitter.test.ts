import { beforeAll, describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { IndexEmitStrategy } from '#src';
import { setupTabs } from '#tests/tablist/-shared';

describe('IndexEmitter', () => {
  const ctx = setupTabs();

  const listeners = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    select() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activateItem() {}
  };

  beforeAll(() => {
    new IndexEmitStrategy(ctx.tabs, listeners);
  });

  test('emits selection', async () => {
    const selectSpy = vi.spyOn(listeners, 'select');

    await userEvent.click(ctx.secondItem);

    expect(selectSpy).toHaveBeenCalledWith([1]);
  });

  test('emits active item', async () => {
    const activateItemSpy = vi.spyOn(listeners, 'activateItem');

    await userEvent.click(ctx.thirdItem);

    expect(activateItemSpy).toHaveBeenCalledWith(2);
  });
});

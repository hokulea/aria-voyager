import { beforeAll, describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { ItemEmitStrategy } from '#src';
import { setupListbox } from '../-shared';

describe('ItemEmitter', () => {
  const ctx = setupListbox();

  let secondItem: Element;
  let thirdItem: Element;

  const listeners = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    select() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activateItem() {}
  };

  beforeAll(() => {
    secondItem = ctx.list.children[1];
    thirdItem = ctx.list.children[2];
    new ItemEmitStrategy(ctx.listbox, listeners);
  });

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

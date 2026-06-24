import { expect, test, vi } from 'vitest';

import { ItemEmitStrategy, Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey, firePointer, focusControl } from '#tests/test-support/events';

test('checked() fires with full array after single toggle', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem } = getItems(listbox);

  const listeners = {
    check: vi.fn()
  };

  new ItemEmitStrategy(listbox, listeners);

  await firePointer(firstItem);

  expect(listeners.check).toHaveBeenCalledWith([firstItem]);
});

test('checked() fires with updated array after batch-toggle', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem, secondItem } = getItems(listbox);

  const listeners = {
    check: vi.fn()
  };

  new ItemEmitStrategy(listbox, listeners);

  await focusControl(list);
  await fireKey(list, 'ArrowDown', { shiftKey: true });
  await fireKey(list, ' ');

  expect(listeners.check).toHaveBeenCalledWith([firstItem, secondItem]);
});

test('selected() fires on range change independently of checked()', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem, secondItem } = getItems(listbox);

  const listeners = {
    select: vi.fn(),
    check: vi.fn()
  };

  new ItemEmitStrategy(listbox, listeners);

  await focusControl(list);
  await fireKey(list, 'ArrowDown', { shiftKey: true });

  expect(listeners.select).toHaveBeenCalledWith([firstItem, secondItem]);
  expect(listeners.check).not.toHaveBeenCalled();
});

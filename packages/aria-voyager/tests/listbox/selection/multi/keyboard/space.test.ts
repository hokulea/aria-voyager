import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

describe('Toggle selection with `Space` key', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem } = getItems(listbox);

  test('focus list', async () => {
    list.focus();

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  });

  test('use `Space` to select active item', async () => {
    await userEvent.keyboard(' ');
    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  });

  test('use `Space` to deselect active item', async () => {
    await userEvent.keyboard(' ');
    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  });
});

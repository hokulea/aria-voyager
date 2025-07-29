import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { List } from '../../../components/list';

describe.skip('Scroll Downwards', () => {
  const listbox = new List(document.body);
  const list = listbox.element;

  list.style.height = '204px';
  list.style.position = 'relative';
  list.style.overflow = 'auto';
  list.style.padding = '0';

  listbox.setItems([...Array.from({ length: 20 }).keys()].map((i) => `Item ${i + 1}`));

  for (const item of listbox.items) {
    item.style.height = '20px';
  }

  const firstItem = list.children[0];

  test('focus list to activate first item', async () => {
    list.focus();
    expect(list.scrollTop).toBe(0);
    await expect.element(list).toHaveFocus();
    await expect.element(list).toHaveAttribute('aria-activedescendant', firstItem.id);
    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  });

  test('use `ArrowDown` but not scroll down', async () => {
    let i = 0;

    while (i <= 8) {
      await userEvent.keyboard('{ArrowDown}');
      i++;
    }

    expect(list.scrollTop).toBe(0);
    await expect.element(list.children[i]).toHaveAttribute('aria-selected', 'true');
  });

  test('use `ArrowDown` to scroll down once', async () => {
    await userEvent.keyboard('{ArrowDown}');
    expect(list.scrollTop).toBe(18);
    await expect.element(list.children[10]).toHaveAttribute('aria-selected', 'true');
  });

  test('use `ArrowDown` to scroll down once more', async () => {
    await userEvent.keyboard('{ArrowDown}');
    expect(list.scrollTop).toBe(38);
    await expect.element(list.children[11]).toHaveAttribute('aria-selected', 'true');
  });
});

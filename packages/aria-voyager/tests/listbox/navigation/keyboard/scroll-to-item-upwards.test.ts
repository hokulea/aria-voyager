import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { List } from '../../../components/list';

describe.skip('Scroll Upwards', () => {
  const listbox = new List(document.body);
  const list = listbox.element;

  list.style.height = '204px';
  list.style.position = 'relative';
  list.style.overflow = 'auto';
  list.style.padding = '0';
  list.style.gap = '0';

  listbox.setItems([...Array.from({ length: 20 }).keys()].map((i) => `Item ${i + 1}`));

  for (const item of listbox.items) {
    item.style.height = '20px';
  }

  const lastIndex = list.children.length;
  const lastItem = list.children[lastIndex - 1];

  test('focus list and activate last item', async () => {
    list.focus();
    await expect.element(list).toHaveFocus();
    expect(list.scrollTop).toBe(0);

    await userEvent.keyboard('{End}');
    await expect.element(list).toHaveAttribute('aria-activedescendant', lastItem.id);
    await expect.element(lastItem).toHaveAttribute('aria-selected', 'true');

    expect(Math.floor(list.scrollTop)).toBe(200);
  });

  test('use `ArrowUp` but not to scroll up', async () => {
    let i = lastIndex - 1;

    while (i >= 12) {
      await userEvent.keyboard('{ArrowUp}');
      i--;
    }

    expect(Math.floor(list.scrollTop)).toBe(200);
    await expect.element(list.children[i]).toHaveAttribute('aria-selected', 'true');
  });

  test('use `ArrowUp` to scroll up once', async () => {
    await userEvent.keyboard('{ArrowUp}');
    expect(Math.floor(list.scrollTop)).toBe(198);
    await expect.element(list.children[10]).toHaveAttribute('aria-selected', 'true');
  });
  test('use `ArrowUp` to scroll up once more', async () => {
    await userEvent.keyboard('{ArrowUp}');
    expect(Math.floor(list.scrollTop)).toBe(178);
    await expect.element(list.children[9]).toHaveAttribute('aria-selected', 'true');
  });
});

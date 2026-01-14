import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { List } from '#tests/components/list';

import { getItems } from '../../-shared';

const listbox = new List(document.body);
const list = listbox.element;

list.style.height = '200px';
list.style.position = 'relative';
list.style.display = 'grid';
list.style.overflow = 'auto';

listbox.setItems([...Array.from({ length: 20 }).keys()].map((i) => `Item ${i + 1}`));
for (const item of listbox.items) item.style.height = '19px';

const { firstItem } = getItems(listbox.listbox);

describe('Scroll Downwards', () => {
  expect(list.scrollTop).toBe(0);

  test('focus list to activate first item', async () => {
    list.focus();
    expect(document.activeElement).toBe(list);
    await expect.element(list).toHaveAttribute('aria-activedescendant', firstItem.id);
  });

  test('use `ArrowDown` to scroll down', async () => {
    let i = 0;

    while (i <= 8) {
      await userEvent.keyboard('{ArrowDown}');
      i++;
    }

    expect(list.scrollTop).toBe(0);
    await expect.element(list.children[i] as HTMLElement).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowDown}');
    expect(Math.round(list.scrollTop)).toBe(11);
    await expect
      .element(list.children[i + 1] as HTMLElement)
      .toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowDown}');
    expect(Math.round(list.scrollTop)).toBe(30);
    await expect
      .element(list.children[i + 2] as HTMLElement)
      .toHaveAttribute('aria-selected', 'true');
  });
});

import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { List } from '../../../components/list';

const listbox = new List(document.body);
const list = listbox.element;

list.style.height = '200px';
list.style.position = 'relative';
list.style.display = 'grid';
list.style.overflow = 'auto';

listbox.setItems([...Array.from({ length: 20 }).keys()].map((i) => `Item ${i + 1}`));
for (const item of listbox.items) item.style.height = '19px';

const firstItem = list.children[0];

describe('Scroll Downwards', () => {
  expect(list.scrollTop).toBe(0);

  test('focus list to activate first item', async () => {
    list.focus();
    await expect.poll(() => document.activeElement).toBe(list);
    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  }));

  test('use `ArrowDown` to scroll down', async () => {
    let i = 0;

    while (i <= 8) {
      await userEvent.keyboard('{ArrowDown}');
      i++;
    }

    expect(list.scrollTop).toBe(0);
    await expect.poll(() => list.children[i].getAttribute('aria-selected')).toBe('true');

    await userEvent.keyboard('{ArrowDown}');
    expect(list.scrollTop).toBe(11);
    await expect.poll(() => list.children[i + 1].getAttribute('aria-selected')).toBe('true');

    await userEvent.keyboard('{ArrowDown}');
    expect(list.scrollTop).toBe(30);
    await expect.poll(() => list.children[i + 2].getAttribute('aria-selected')).toBe('true');
  });
});

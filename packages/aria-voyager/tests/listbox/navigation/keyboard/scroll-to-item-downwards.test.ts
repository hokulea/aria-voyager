import { describe, expect, it } from 'vitest';

import { List } from '../../../components/list';

const listbox = new List(document.body);
const list = listbox.element;

list.style.height = '200px';
list.style.position = 'relative';
list.style.display = 'grid';
list.style.overflow = 'auto';

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
listbox.setItems([...Array(20).keys()].map((i) => `Item ${i + 1}`));
listbox.items.forEach((item) => (item.style.height = '19px'));

const firstItem = list.children[0];

describe('Scroll Downwards', () => {
  expect(list.scrollTop).toBe(0);

  it('use `Home` key to activate first item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
  });

  it('use `ArrowDown` to scroll down', () => {
    let i = 0;

    while (i <= 8) {
      list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      i++;
    }

    expect(list.scrollTop).toBe(0);
    expect(list.children[i].getAttribute('aria-selected')).toBe('true');

    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(list.scrollTop).toBe(11);
    expect(list.children[i + 1].getAttribute('aria-selected')).toBe('true');

    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(list.scrollTop).toBe(30);
    expect(list.children[i + 2].getAttribute('aria-selected')).toBe('true');
  });
});

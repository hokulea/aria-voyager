import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte/pure';

import List from '../components/List.svelte';

test('tabindex is set', () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear']
  });

  const element = screen.getByRole('listbox');
  const list = element.element() as HTMLElement;

  expect(list).toHaveAttribute('tabindex', '0');
});

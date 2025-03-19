import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte/pure';

import List from '../components/List.svelte';

describe('Reactivity: disabled', () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear']
  });

  const element = screen.getByRole('listbox');
  const list = element.element() as HTMLElement;

  test('disabled works', async () => {
    expect(list).not.toHaveAttribute('aria-disabled');
    expect(list).toHaveAttribute('tabindex', '0');

    await screen.rerender({
      disabled: true
    });

    expect(list).toHaveAttribute('aria-disabled', 'true');
    expect(list).toHaveAttribute('tabindex', '-1');

    await screen.rerender({
      disabled: false
    });

    expect(list).not.toHaveAttribute('aria-disabled');
    expect(list).toHaveAttribute('tabindex', '0');
  });
});

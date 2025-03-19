import { describe } from 'vitest';
import { render } from 'vitest-browser-svelte/pure';

import List from '../components/List.svelte';
import { testListboxKeyboardNavigation } from './-list';

describe('Navigation: Keyboard', () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear']
  });

  const list = screen.getByRole('listbox');

  testListboxKeyboardNavigation(list);
});

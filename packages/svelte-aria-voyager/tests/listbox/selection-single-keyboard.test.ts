import { describe } from 'vitest';
import { render } from 'vitest-browser-svelte/pure';

import List from '../components/List.svelte';
import { testListboxForKeyboardSingleSelection } from './-list';

describe('Selection (Single): Keyboard', () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear']
  });

  const list = screen.getByRole('listbox');

  testListboxForKeyboardSingleSelection(list);
});

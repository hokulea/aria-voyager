import { describe } from 'vitest';
import { render } from 'vitest-browser-svelte/pure';

import List from '../components/List.svelte';
import { testListboxForKeyboardMultiSelection } from './-list';

describe('Selection (Multi): Keyboard', () => {
  const screen = render(List, {
    items: ['Banana', 'Apple', 'Pear'],
    multi: true
  });

  const list = screen.getByRole('listbox');

  testListboxForKeyboardMultiSelection(list);
});

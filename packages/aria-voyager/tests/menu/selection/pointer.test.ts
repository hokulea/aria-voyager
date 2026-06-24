import { expect, test, vi } from 'vitest';

import { ItemEmitStrategy, Menu } from '#src';
import { appendRadioItems, createMenuElement } from '#tests/components/menu';

import { firePointer } from '#tests/test-support/events';

test('Pointer click on disabled radio item does nothing', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);
  const [top, middle, bottom] = appendRadioItems(menuElement, ['Top', 'Middle', 'Bottom']);

  middle.setAttribute('aria-disabled', 'true');

  const menu = new Menu(menuElement);
  const listeners = {
    select: vi.fn(),
    activateItem: vi.fn()
  };

  new ItemEmitStrategy(menu, listeners);

  await annotate('first item is checked by default');
  await expect.element(top).toHaveAttribute('aria-checked', 'true');

  await annotate('click disabled middle item');
  await firePointer(middle);
  await expect.element(top).toHaveAttribute('aria-checked', 'true');
  await expect.element(middle).toHaveAttribute('aria-checked', 'false');
  await expect.element(bottom).toHaveAttribute('aria-checked', 'false');

  menu.dispose();
});

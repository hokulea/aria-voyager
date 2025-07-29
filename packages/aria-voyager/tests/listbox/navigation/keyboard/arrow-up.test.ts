import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

describe('Navigate with `ArrowUp`', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', async () => {
    await expect.poll(() => expect.element(list)).not.toHaveAttribute('aria-activedescendant');
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });

  test('focus list to activate first item', async () => {
    list.focus();
    await expect.poll(() => expect.element(list)).toBeFocused();
    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', firstItem.id);
  });

  test('use `End` key to activate last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', thirdItem.id);
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).toHaveAttribute('aria-current', 'true');
  });

  test('use `ArrowUp` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', secondItem.id);
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });

  test('use `ArrowUp` key to activate first item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', firstItem.id);
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });

  test('use `ArrowUp` key to, but keep first item activated (hit beginning of list)', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', firstItem.id);
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });
});

describe('Navigate with `ArrowUp`, skip disabled item', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  secondItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.poll(() => expect.element(list)).not.toHaveAttribute('aria-activedescendant');
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });

  test('focus list to activate first item', async () => {
    list.focus();
    await expect.poll(() => expect.element(list)).toBeFocused();
    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', firstItem.id);
  });

  test('use `End` key to activate last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', thirdItem.id);
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).toHaveAttribute('aria-current', 'true');
  });

  test('use `ArrowUp` key to activate first item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', firstItem.id);
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });
});

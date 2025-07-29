import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

describe('navigates with `Home`', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', async () => {
    await expect.poll(() => expect.element(list)).not.toHaveAttribute('aria-activedescendant');
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });

  test('focus list and activate last item', async () => {
    list.focus();
    await expect.poll(() => expect.element(list)).toBeFocused();
    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', firstItem.id);

    await userEvent.keyboard('{End}');
    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', thirdItem.id);
  });

  test('use `Home` key to activate last item', async () => {
    await userEvent.keyboard('{Home}');

    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', firstItem.id);
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });
});

describe('navigates with `Home`, skip disabled item', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  firstItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.poll(() => expect.element(list)).not.toHaveAttribute('aria-activedescendant');
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });

  test('focus list and activate last item', async () => {
    list.focus();

    await expect.poll(() => expect.element(list)).toBeFocused();
    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', secondItem.id);

    await userEvent.keyboard('{End}');
    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', thirdItem.id);
  });

  test('use `Home` key to activate last item', async () => {
    await userEvent.keyboard('{Home}');

    await expect.poll(() => expect.element(list)).toHaveAttribute('aria-activedescendant', secondItem.id);
    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
    await expect.poll(() => expect.element(secondItem)).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-current');
  });
});

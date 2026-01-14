import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

describe('Navigate with `ArrowUp`', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', async () => {
    await expect.element(list).not.toHaveAttribute('aria-activedescendant');
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });

  test('focus list to activate first item', () => {
    list.focus();
    expect(document.activeElement).toBe(list);
    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  });

  test('use `End` key to activate last item', async () => {
    await userEvent.keyboard('{End}');

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');
  });

  test('use `ArrowUp` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });

  test('use `ArrowUp` key to activate first item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });

  test('use `ArrowUp` key to, but keep first item activated (hit beginning of list)', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });
});

describe('Navigate with `ArrowUp`, skip disabled item', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  secondItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.element(list).not.toHaveAttribute('aria-activedescendant');
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });

  test('focus list to activate first item', () => {
    list.focus();
    expect(document.activeElement).toBe(list);
    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  });

  test('use `End` key to activate last item', async () => {
    await userEvent.keyboard('{End}');

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    await expect.element(firstItem).not.toHaveAttribute('aria-current');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');
  });

  test('use `ArrowUp` key to activate first item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
    await expect.element(secondItem).not.toHaveAttribute('aria-current');
    await expect.element(thirdItem).not.toHaveAttribute('aria-current');
  });
});

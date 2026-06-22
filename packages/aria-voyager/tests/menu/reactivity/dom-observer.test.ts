import { describe, expect, test, vi } from 'vitest';

import { Menu } from '#src';
import {
  appendCheckboxItemToMenu,
  appendItemToMenu,
  appendRadioGroup,
  appendRadioItems,
  createMenuElement,
  getItems
} from '#tests/components/menu';
import { createCodeMenu } from '#tests/menu/-shared';

test('DOM Observer', async ({ annotate }) => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);

  expect(menu.items.length).toBe(15);

  await annotate('reads elements on appending');
  appendItemToMenu(codeMenu, 'Command Palette');

  await vi.waitUntil(() => getItems(codeMenu).length === 16);

  expect(menu.items.length).toBe(16);

  await annotate('sets tabindex to -1 when the aria-disabled is `true`');
  await expect.element(menu.items[0]).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  codeMenu.setAttribute('aria-disabled', 'true');

  await expect.element(codeMenu).toHaveAttribute('aria-disabled', 'true');

  for (const item of menu.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('re-sets tabindex to 0 when the aria-disabled is removed');

  for (const item of menu.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  codeMenu.removeAttribute('aria-disabled');

  await expect.element(codeMenu).not.toHaveAttribute('aria-disabled');

  await expect.element(menu.items[0]).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

describe('menuitemcheckbox', () => {
  test('DOM Observer detects appended menuitemcheckbox items', async ({ annotate }) => {
    const { codeMenu } = createCodeMenu();
    const menu = new Menu(codeMenu);

    const initialCount = menu.items.length;

    await annotate('append a menuitemcheckbox');
    appendCheckboxItemToMenu(codeMenu, 'Bold');

    await vi.waitUntil(() => getItems(codeMenu).length === initialCount + 1);

    expect(menu.items.length).toBe(initialCount + 1);
    expect(menu.items.at(-1)?.getAttribute('role')).toBe('menuitemcheckbox');

    menu.dispose();
  });

  test('DOM Observer detects menuitemcheckbox inside role="group"', async () => {
    const menuElement = createMenuElement(document.body);

    const g = appendRadioGroup(menuElement);

    appendCheckboxItemToMenu(g, 'Bold', true);
    appendCheckboxItemToMenu(g, 'Italic');

    const menu = new Menu(menuElement);

    expect(menu.items).toHaveLength(2);
    await expect.element(menu.items[0]).toHaveAttribute('aria-checked', 'true');
    await expect.element(menu.items[1]).toHaveAttribute('aria-checked', 'false');

    menu.dispose();
  });
});

describe('menuitemradio', () => {
  test('DOM Observer detects appended menuitemradio items', async ({ annotate }) => {
    const { codeMenu } = createCodeMenu();
    const menu = new Menu(codeMenu);

    const initialCount = menu.items.length;

    await annotate('append a menuitemradio');
    appendRadioItems(codeMenu, ['Top']);

    await vi.waitUntil(() => getItems(codeMenu).length === initialCount + 1);

    expect(menu.items.length).toBe(initialCount + 1);
    expect(menu.items.at(-1)?.getAttribute('role')).toBe('menuitemradio');

    menu.dispose();
  });

  test('DOM Observer detects menuitemradio inside role="group"', async () => {
    const menuElement = createMenuElement(document.body);

    const g = appendRadioGroup(menuElement);

    appendRadioItems(g, ['Top', 'Bottom']);

    const menu = new Menu(menuElement);

    expect(menu.items).toHaveLength(2);
    expect(menu.items[0]?.getAttribute('role')).toBe('menuitemradio');
    expect(menu.items[1]?.getAttribute('role')).toBe('menuitemradio');
    await expect.element(menu.items[0]).toHaveAttribute('aria-checked', 'true');

    menu.dispose();
  });

  test('DOM Observer re-groups after separator is added', async ({ annotate }) => {
    const menuElement = createMenuElement(document.body);

    appendRadioItems(menuElement, ['A', 'B', 'C', 'D']);

    const menu = new Menu(menuElement);

    await annotate('initial state: all items one group, A checked');
    await expect.element(menu.items[0]).toHaveAttribute('aria-checked', 'true');

    await annotate('add separator between B and C');

    const hr = document.createElement('hr');

    menuElement.children[2].before(hr);

    await vi.waitUntil(() => [...menuElement.children].some((c) => c instanceof HTMLHRElement));

    await annotate('trigger re-read');
    menu.readItems();

    await annotate('group 1 (after separator): first item C should now be checked');
    await expect.element(menu.items[2]).toHaveAttribute('aria-checked', 'true');

    menu.dispose();
  });
});

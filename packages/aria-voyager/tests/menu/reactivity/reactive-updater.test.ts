import { describe, expect, test } from 'vitest';

import { Menu, ReactiveUpdateStrategy } from '#src';
import {
  appendCheckboxItemToMenu,
  appendRadioItems,
  createMenuElement
} from '#tests/components/menu';
import { createCodeMenu } from '#tests/menu/-shared';

test('Reactive Updater', async ({ annotate }) => {
  const updater = new ReactiveUpdateStrategy();
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu, { updater });

  expect(menu.items.length).toBe(15);

  await annotate('reads elements on appending');

  const { appendItemToMenu } = await import('#tests/components/menu');

  appendItemToMenu(codeMenu, 'Command Palette');

  updater.updateItems();

  expect(menu.items.length).toBe(16);

  await annotate('sets tabindex to -1 when the aria-disabled is `true`');
  expect(menu.items[0].getAttribute('tabindex')).toBe('0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  codeMenu.setAttribute('aria-disabled', 'true');

  updater.updateOptions();

  for (const item of menu.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('re-sets tabindex to 0 when the aria-disabled is removed');

  for (const item of menu.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  codeMenu.removeAttribute('aria-disabled');

  updater.updateOptions();

  expect(menu.items[0].getAttribute('tabindex')).toBe('0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

describe('menuitemcheckbox', () => {
  test('ReactiveUpdater re-reads menuitemcheckbox items', async ({ annotate }) => {
    const updater = new ReactiveUpdateStrategy();
    const { codeMenu } = createCodeMenu();
    const menu = new Menu(codeMenu, { updater });
    const initialCount = menu.items.length;

    await annotate('append a menuitemcheckbox and trigger update');
    appendCheckboxItemToMenu(codeMenu, 'Bold');
    updater.updateItems();

    expect(menu.items.length).toBe(initialCount + 1);
    expect(menu.items.at(-1)?.getAttribute('role')).toBe('menuitemcheckbox');

    menu.dispose();
  });
});

describe('menuitemradio', () => {
  test('ReactiveUpdater re-reads menuitemradio items', async ({ annotate }) => {
    const updater = new ReactiveUpdateStrategy();
    const { codeMenu } = createCodeMenu();
    const menu = new Menu(codeMenu, { updater });
    const initialCount = menu.items.length;

    await annotate('append a menuitemradio and trigger update');
    appendRadioItems(codeMenu, ['Top']);
    updater.updateItems();

    expect(menu.items.length).toBe(initialCount + 1);
    expect(menu.items.at(-1)?.getAttribute('role')).toBe('menuitemradio');

    menu.dispose();
  });

  test('ReactiveUpdater re-groups after separator added', async ({ annotate }) => {
    const updater = new ReactiveUpdateStrategy();
    const menuElement = createMenuElement(document.body);

    appendRadioItems(menuElement, ['A', 'B', 'C']);

    const menu = new Menu(menuElement, { updater });

    await annotate('initial state: one group, A checked');
    await expect.element(menu.items[0]).toHaveAttribute('aria-checked', 'true');
    await expect.element(menu.items[1]).toHaveAttribute('aria-checked', 'false');

    await annotate('insert separator between A and B');

    const hr = document.createElement('hr');

    menuElement.children[1].before(hr);
    updater.updateItems();

    await annotate('group 1: A still checked; group 2: B checked (first in new group)');
    await expect.element(menu.items[0]).toHaveAttribute('aria-checked', 'true');
    await expect.element(menu.items[1]).toHaveAttribute('aria-checked', 'true');
    await expect.element(menu.items[2]).toHaveAttribute('aria-checked', 'false');

    menu.dispose();
  });
});

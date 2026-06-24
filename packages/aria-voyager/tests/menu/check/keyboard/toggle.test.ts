import { expect, test } from 'vitest';

import { Menu } from '#src';
import {
  appendCheckboxItemToMenu,
  appendItemToMenu,
  createMenuElement
} from '#tests/components/menu';

import { fireKey } from '#tests/test-support/events';

test('Space on menuitemcheckbox toggles aria-checked', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  appendItemToMenu(menuElement, 'Cut');
  appendCheckboxItemToMenu(menuElement, 'Bold', false);
  appendCheckboxItemToMenu(menuElement, 'Italic', false);
  appendItemToMenu(menuElement, 'Paste');

  const menu = new Menu(menuElement);
  const checkbox1 = menu.items[1];
  const checkbox2 = menu.items[2];

  await expect.element(checkbox1).toHaveAttribute('aria-checked', 'false');
  await expect.element(checkbox2).toHaveAttribute('aria-checked', 'false');

  await annotate('focus first checkbox');
  checkbox1.focus();

  await annotate('use Space to toggle first checkbox');
  await fireKey(menuElement, ' ');

  await expect.element(checkbox1).toHaveAttribute('aria-checked', 'true');
  await expect.element(checkbox2).toHaveAttribute('aria-checked', 'false');

  await annotate('use Space again to uncheck first checkbox');
  await fireKey(menuElement, ' ');

  await expect.element(checkbox1).toHaveAttribute('aria-checked', 'false');
  await expect.element(checkbox2).toHaveAttribute('aria-checked', 'false');

  await annotate('navigate to second checkbox and toggle it');
  await fireKey(menuElement, 'ArrowDown');
  await fireKey(menuElement, ' ');

  await expect.element(checkbox1).toHaveAttribute('aria-checked', 'false');
  await expect.element(checkbox2).toHaveAttribute('aria-checked', 'true');

  menu.dispose();
});

test('Space on checkbox, skip disabled checkbox', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  appendCheckboxItemToMenu(menuElement, 'Bold', false);
  appendCheckboxItemToMenu(menuElement, 'Italic', false);
  appendCheckboxItemToMenu(menuElement, 'Underline', false);

  const menu = new Menu(menuElement);
  const [bold, italic, underline] = menu.items;

  italic.setAttribute('aria-disabled', 'true');

  await annotate('focus Bold and toggle it');
  bold.focus();
  await fireKey(menuElement, ' ');

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'false');

  await annotate('navigate past disabled Italic to Underline');
  await fireKey(menuElement, 'ArrowDown');
  await fireKey(menuElement, ' ');

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'false');
  await expect.element(underline).toHaveAttribute('aria-checked', 'true');

  menu.dispose();
});

test('Multiple checkboxes can be checked independently', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  appendCheckboxItemToMenu(menuElement, 'Bold', false);
  appendCheckboxItemToMenu(menuElement, 'Italic', false);
  appendCheckboxItemToMenu(menuElement, 'Underline', false);

  const menu = new Menu(menuElement);
  const [bold, italic, underline] = menu.items;

  await annotate('focus bold');
  bold.focus();

  await annotate('toggle Bold');
  await fireKey(menuElement, ' ');

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'false');
  await expect.element(underline).toHaveAttribute('aria-checked', 'false');

  await annotate('navigate to Italic and toggle it');
  await fireKey(menuElement, 'ArrowDown');
  await fireKey(menuElement, ' ');

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'true');
  await expect.element(underline).toHaveAttribute('aria-checked', 'false');

  await annotate('navigate to Underline and toggle it');
  await fireKey(menuElement, 'ArrowDown');
  await fireKey(menuElement, ' ');

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'true');
  await expect.element(underline).toHaveAttribute('aria-checked', 'true');

  menu.dispose();
});

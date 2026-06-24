import { expect, test } from 'vitest';

import { Menu } from '#src';
import {
  appendCheckboxItemToMenu,
  appendItemToMenu,
  createMenuElement
} from '#tests/components/menu';

import { firePointer } from '#tests/test-support/events';

test('Click on menuitemcheckbox toggles aria-checked', async ({ annotate }) => {
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

  await annotate('click first checkbox to toggle it on');
  await firePointer(checkbox1);

  await expect.element(checkbox1).toHaveAttribute('aria-checked', 'true');
  await expect.element(checkbox2).toHaveAttribute('aria-checked', 'false');

  await annotate('click first checkbox again to toggle it off');
  await firePointer(checkbox1);

  await expect.element(checkbox1).toHaveAttribute('aria-checked', 'false');
  await expect.element(checkbox2).toHaveAttribute('aria-checked', 'false');

  await annotate('click second checkbox');
  await firePointer(checkbox2);

  await expect.element(checkbox1).toHaveAttribute('aria-checked', 'false');
  await expect.element(checkbox2).toHaveAttribute('aria-checked', 'true');

  menu.dispose();
});

test('Multiple checkboxes can be checked independently via click', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  appendCheckboxItemToMenu(menuElement, 'Bold', false);
  appendCheckboxItemToMenu(menuElement, 'Italic', false);
  appendCheckboxItemToMenu(menuElement, 'Underline', false);

  const menu = new Menu(menuElement);
  const [bold, italic, underline] = menu.items;

  await annotate('click Bold');
  await firePointer(bold);

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'false');
  await expect.element(underline).toHaveAttribute('aria-checked', 'false');

  await annotate('click Italic');
  await firePointer(italic);

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'true');
  await expect.element(underline).toHaveAttribute('aria-checked', 'false');

  await annotate('click Underline');
  await firePointer(underline);

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'true');
  await expect.element(underline).toHaveAttribute('aria-checked', 'true');

  await annotate('click Bold again to uncheck');
  await firePointer(bold);

  await expect.element(bold).toHaveAttribute('aria-checked', 'false');
  await expect.element(italic).toHaveAttribute('aria-checked', 'true');
  await expect.element(underline).toHaveAttribute('aria-checked', 'true');

  menu.dispose();
});

test('Click checkbox, skip disabled checkbox', async ({ annotate }) => {
  const menuElement = createMenuElement(document.body);

  appendCheckboxItemToMenu(menuElement, 'Bold', false);
  appendCheckboxItemToMenu(menuElement, 'Italic', false);
  appendCheckboxItemToMenu(menuElement, 'Underline', false);

  const menu = new Menu(menuElement);
  const [bold, italic, underline] = menu.items;

  italic.setAttribute('aria-disabled', 'true');

  await annotate('click Bold');
  await firePointer(bold);

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'false');
  await expect.element(underline).toHaveAttribute('aria-checked', 'false');

  await annotate('click disabled Italic does nothing');
  await firePointer(italic);

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'false');
  await expect.element(underline).toHaveAttribute('aria-checked', 'false');

  await annotate('click Underline');
  await firePointer(underline);

  await expect.element(bold).toHaveAttribute('aria-checked', 'true');
  await expect.element(italic).toHaveAttribute('aria-checked', 'false');
  await expect.element(underline).toHaveAttribute('aria-checked', 'true');

  menu.dispose();
});

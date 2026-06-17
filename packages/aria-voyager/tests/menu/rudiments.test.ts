import { expect, test } from 'vitest';

import { Menu } from '#src';
import { createMenuElement } from '#tests/components/menu';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

test('renders', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);

  expect(menu.items.length).toBe(15);
});

test('setup', async ({ annotate }) => {
  const menu = new Menu(createMenuElement(document.body));

  await expect.element(menu.element).toHaveAttribute('role', 'menu');

  await annotate('arrange code menu');

  const { codeMenu } = createCodeMenu();
  const code = new Menu(codeMenu);
  const { firstItem } = getItems(code);

  await annotate('sets tabindex on the first item');
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  await annotate('reads items');
  expect(code.items.length).toBe(15);

  await annotate('items have tabindex');

  for (const item of code.items) {
    await expect.element(item).toHaveAttribute('tabindex');
  }
});

test('disabled', async () => {
  const { codeMenu } = createCodeMenu();

  codeMenu.setAttribute('aria-disabled', 'true');

  const menu = new Menu(codeMenu);

  for (const item of menu.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

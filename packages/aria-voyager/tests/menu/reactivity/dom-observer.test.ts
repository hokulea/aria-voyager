import { expect, test, vi } from 'vitest';

import { Menu } from '#src';
import { appendItemToMenu, getItems } from '#tests/components/menu';
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

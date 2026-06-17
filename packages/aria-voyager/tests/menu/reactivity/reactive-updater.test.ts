import { expect, test } from 'vitest';

import { Menu, ReactiveUpdateStrategy } from '#src';
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

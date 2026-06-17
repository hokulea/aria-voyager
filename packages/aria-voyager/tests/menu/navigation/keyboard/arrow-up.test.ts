import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

test('Navigate with `ArrowUp`', async ({ annotate }) => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, lastItem, secondLastItem, thirdLastItem } = getItems(menu);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  firstItem.focus();

  await annotate('use `ArrowUp` at first item does nothing');
  await userEvent.keyboard('{ArrowUp}');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `END` to jump to the last item');
  await userEvent.keyboard('{End}');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate second last item');
  await userEvent.keyboard('{ArrowUp}');

  await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate third last item');
  await userEvent.keyboard('{ArrowUp}');

  await expect.element(thirdLastItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.filter((_, idx) => idx !== menu.items.indexOf(thirdLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

test('navigate with `ArrowUp`, skip disabled items', async ({ annotate }) => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, lastItem, secondLastItem, fourthLastItem } = getItems(menu);

  const thirdLastItem = menu.items.at(-3) as HTMLElement;

  thirdLastItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  firstItem.focus();

  await annotate('use `END` to jump to the last item');
  await userEvent.keyboard('{End}');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate second last item');
  await userEvent.keyboard('{ArrowUp}');

  await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate fourth last item');
  await userEvent.keyboard('{ArrowUp}');

  await expect.element(fourthLastItem).toHaveAttribute('tabindex', '0');

  for (const item of menu.items.filter((_, idx) => idx !== menu.items.indexOf(fourthLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

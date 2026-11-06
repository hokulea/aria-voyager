import { expect, test } from 'vitest';

import { Tablist } from '#src';
import { appendTab, createTabElement } from '#tests/components/tabs';
import { createTabs, getTabItems } from '#tests/tablist/-shared';

import { fireKey, firePointer } from '#tests/test-support/events';

test('`focusDisabledItems` moves focus onto disabled tabs without selecting them', async ({
  annotate
}) => {
  const { tablist, tabs } = createTabs({ focusDisabledItems: true });
  const { firstItem, secondItem, thirdItem, lastItem } = getTabItems(tabs);

  secondItem.setAttribute('aria-disabled', 'true');
  lastItem.setAttribute('aria-disabled', 'true');

  firstItem.focus();

  await annotate('use `ArrowRight` key to focus the disabled second item');
  await fireKey(tablist, 'ArrowRight');

  expect(document.activeElement).toBe(secondItem);
  await expect.element(secondItem).toHaveAttribute('tabindex', '0');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

  await annotate('use `ArrowRight` key to focus and select the third item');
  await fireKey(tablist, 'ArrowRight');

  expect(document.activeElement).toBe(thirdItem);
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

  await annotate('use `End` key to focus the disabled last item');
  await fireKey(tablist, 'End');

  expect(document.activeElement).toBe(lastItem);
  await expect.element(lastItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

  await annotate('use pointer on the disabled second item does not select it');
  await firePointer(secondItem);

  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});

test('`focusDisabledItems` never selects a disabled tab with manual activation', async ({
  annotate
}) => {
  const { tablist, tabs } = createTabs({
    focusDisabledItems: true,
    behavior: { singleSelection: 'manual' }
  });
  const { firstItem, secondItem } = getTabItems(tabs);

  secondItem.setAttribute('aria-disabled', 'true');

  firstItem.focus();
  await fireKey(tablist, 'ArrowRight');

  await annotate('use spacebar on the disabled second item');
  await fireKey(tablist, ' ');

  expect(document.activeElement).toBe(secondItem);
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
});

test('`focusDisabledItems` keeps a tab list of only disabled tabs reachable', async ({
  annotate
}) => {
  const { container, tablist } = createTabElement(document.body);

  for (let i = 1; i <= 3; i++) {
    appendTab(container, `Tab ${i.toString()}`, `Content ${i.toString()}`);
  }

  const items = [...tablist.querySelectorAll(':scope [role="tab"]')];

  for (const item of items) {
    item.setAttribute('aria-disabled', 'true');
  }

  // a selection from the outside, so the tablist does not pick a tab itself
  items[1]?.setAttribute('aria-selected', 'true');

  const tabs = new Tablist(tablist, { focusDisabledItems: true });
  const [firstItem, secondItem] = tabs.items;

  await annotate('the first tab takes the tab stop');
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  firstItem.focus();
  await fireKey(tablist, 'ArrowRight');

  expect(document.activeElement).toBe(secondItem);
});

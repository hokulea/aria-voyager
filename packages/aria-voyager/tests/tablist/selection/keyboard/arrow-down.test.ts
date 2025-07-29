import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Select with `ArrowDown`', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem, lastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');

  test('start', async () => {
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();

    firstItem.focus();
    await expect.poll(() => expect.element(firstItem)).toBeFocused();
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => expect.element(secondItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items.filter((_, idx) => idx !== 1).every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => expect.element(thirdItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items.filter((_, idx) => idx !== 2).every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });

  test('use `ArrowDown` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => expect.element(lastItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(0, -1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();
  });
});

describe('select with `ArrowDown`, skipping disabled items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');
  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();
    await expect.poll(() => tabs.activeItem).toBeTruthy();

    firstItem.focus();
    await expect.poll(() => expect.element(firstItem)).toBeFocused();
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => expect.element(secondItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items.filter((_, idx) => idx !== 1).every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });

  test('use `ArrowDown` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => expect.element(fourthItem)).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items.filter((_, idx) => idx !== 3).every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });
});

import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Select manually with spacebar`', () => {
  const { tabs } = createTabs({
    behavior: {
      singleSelection: 'manual'
    }
  });
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    expect(firstItem).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();

    firstItem.focus();
    await expect.poll(() => expect.element(firstItem)).toHaveFocus();
  });

  test('use `ArrowRight` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    expect(firstItem).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();

    expect(secondItem).toHaveAttribute('tabindex', '0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== 1)
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });

  test('use `ArrowRight` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    expect(firstItem).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected')))
      .toBeFalsy();

    expect(fourthItem).toHaveAttribute('tabindex', '0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== 3)
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });

  test('use spacebar to select fourth item', async () => {
    await userEvent.keyboard('{ }');

    expect(fourthItem).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items.filter((_, idx) => idx !== 4).every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });

  test('use `ArrowLeft` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    expect(fourthItem).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items.filter((_, idx) => idx !== 4).every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();

    expect(secondItem).toHaveAttribute('tabindex', '0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== 1)
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });

  test('use spacebar to select second item', async () => {
    await userEvent.keyboard('{ }');

    expect(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        tabs.items.filter((_, idx) => idx !== 1).every((item) => item.hasAttribute('aria-selected'))
      )
      .toBeFalsy();
  });
});

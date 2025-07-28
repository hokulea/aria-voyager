import {
  focus,
  getRootElement,
  type Target,
  triggerEvent,
  triggerKeyEvent
} from '@ember/test-helpers';

import { getCompositeItems } from './-private/composite.ts';

type Selectors = {
  tablist: string;
  item: string;
};

type Elements = {
  tablist: HTMLElement;
};

const DEFAULT_SELECTORS = {
  tablist: '[role="tablist"]',
  item: '[role="tab"]'
};

function setupTablistTest(
  assert: Assert,
  selectors: Partial<Selectors>
): { elements: Elements; selectors: Selectors } {
  const fullSelectors = { ...DEFAULT_SELECTORS, ...selectors };
  const tablist = getRootElement().querySelector(selectors.tablist as string);

  assert.dom(tablist).exists('Tablist exists');

  return {
    elements: {
      tablist: tablist as HTMLElement
    },
    selectors: fullSelectors
  };
}

//
// KEYBOARD
//

export async function testTablistKeyboardNavigation(
  assert: Assert,
  selectors: Partial<Selectors> = DEFAULT_SELECTORS
): Promise<void> {
  const { elements, selectors: fullSelectors } = setupTablistTest(assert, selectors);
  const { tablist } = elements;
  const options = getCompositeItems(tablist, fullSelectors.item);
  const [first, second, third] = options;

  await focus(first as HTMLElement);

  assert.dom(first).hasAttribute('tabindex', '0');

  await triggerKeyEvent(tablist, 'keydown', 'ArrowRight');

  assert.dom(first).hasAttribute('tabindex', '-1');
  assert.dom(second).hasAttribute('tabindex', '0');

  await triggerKeyEvent(tablist, 'keydown', 'ArrowRight');

  assert.dom(second).hasAttribute('tabindex', '-1');
  assert.dom(third).hasAttribute('tabindex', '0');

  await triggerKeyEvent(tablist, 'keydown', 'ArrowLeft');

  assert.dom(first).hasAttribute('tabindex', '-1');
  assert.dom(second).hasAttribute('tabindex', '0');

  await triggerKeyEvent(tablist, 'keydown', 'ArrowLeft');

  assert.dom(first).hasAttribute('tabindex', '0');
  assert.dom(second).hasAttribute('tabindex', '-1');
}

export async function testTablistKeyboardAutomaticSelection(
  assert: Assert,
  selectors: Partial<Selectors> = DEFAULT_SELECTORS
): Promise<void> {
  const { elements, selectors: fullSelectors } = setupTablistTest(assert, selectors);
  const { tablist } = elements;
  const options = getCompositeItems(tablist, fullSelectors.item);
  const [first, second, third] = options;
  const last = options.at(-1);

  assert.dom(first).hasAria('selected', 'true', 'First option is selected');

  await triggerKeyEvent(tablist, 'keydown', 'ArrowRight');
  assert.dom(second).hasAria('selected', 'true', 'ArrowRight selects second option');
  assert.dom(first).doesNotHaveAria('selected', '... and deselects first option');

  await triggerKeyEvent(tablist, 'keydown', 'ArrowRight');
  assert.dom(third).hasAria('selected', 'true', 'ArrowRight selects last option');

  await triggerKeyEvent(tablist, 'keydown', 'Home');
  assert.dom(first).hasAria('selected', 'true', 'Home selects first option');

  await triggerKeyEvent(tablist, 'keydown', 'End');
  assert.dom(last).hasAria('selected', 'true', 'End selects last option');
}

export async function testTablistKeyboardManualSelection(
  assert: Assert,
  selectors: Partial<Selectors> = DEFAULT_SELECTORS
): Promise<void> {
  const { elements, selectors: fullSelectors } = setupTablistTest(assert, selectors);
  const { tablist } = elements;
  const options = getCompositeItems(tablist, fullSelectors.item);
  const [first, second, third] = options;
  const last = options.at(-1);

  assert.dom(first).hasAria('selected', 'true', 'First option is selected');

  await triggerKeyEvent(tablist, 'keydown', 'ArrowRight');
  await triggerKeyEvent(tablist, 'keydown', ' ');
  assert.dom(second).hasAria('selected', 'true', 'ArrowRight + SPACE selects second option');
  assert.dom(first).doesNotHaveAria('selected', '... and deselects first option');

  await triggerKeyEvent(tablist, 'keydown', 'End');
  await triggerKeyEvent(tablist, 'keydown', ' ');
  assert.dom(last).hasAria('selected', 'true', 'End + SPACE selects last option');
  assert.dom(second).doesNotHaveAria('selected', '... and deselects second option');

  await triggerKeyEvent(tablist, 'keydown', 'Home');
  await triggerKeyEvent(tablist, 'keydown', ' ');

  assert.dom(first).hasAria('selected', 'true', 'Home + SPACE selects first option');
  assert.dom(last).doesNotHaveAria('selected', '... and deselects last option still selected');

  await triggerKeyEvent(tablist, 'keydown', 'ArrowRight');
  await triggerKeyEvent(tablist, 'keydown', 'ArrowRight');
  await triggerKeyEvent(tablist, 'keydown', ' ');
  assert.dom(third).hasAria('selected', 'true', '2x ArrowRight + SPACE selects third option');
  assert.dom(first).doesNotHaveAria('selected', '... and deselects first option');

  await triggerKeyEvent(tablist, 'keydown', 'ArrowLeft');
  await triggerKeyEvent(tablist, 'keydown', ' ');
  assert.dom(second).hasAria('selected', 'true', 'ArrowLeft + SPACE selects second option');
  assert.dom(third).doesNotHaveAria('selected', '... and deselects third option');
}

//
// POINTER
//

export async function testTablistPointerNavigation(
  assert: Assert,
  selectors: Partial<Selectors> = DEFAULT_SELECTORS
): Promise<void> {
  const { elements, selectors: fullSelectors } = setupTablistTest(assert, selectors);
  const { tablist } = elements;
  const [first, second, third] = getCompositeItems(tablist, fullSelectors.item);

  await triggerEvent(first as HTMLElement, 'pointerup');
  assert.dom(first).hasAttribute('tabindex', '0', 'Clicking first option activates it');

  await triggerEvent(second as HTMLElement, 'pointerup');
  assert.dom(second).hasAttribute('tabindex', '0', 'Clicking second option activates it');
  assert.dom(first).hasAttribute('tabindex', '-1', '... and deactivates first option');

  await triggerEvent(third as HTMLElement, 'pointerup');
  assert.dom(third).hasAttribute('tabindex', '0', 'Clicking last option activates it');
  assert.dom(second).hasAttribute('tabindex', '-1', '... and deactivates second option');
}

export async function testTablistPointerSelection(
  assert: Assert,
  selectors: Partial<Selectors> = DEFAULT_SELECTORS
): Promise<void> {
  const { elements, selectors: fullSelectors } = setupTablistTest(assert, selectors);
  const { tablist } = elements;
  const [first, second, third] = getCompositeItems(tablist, fullSelectors.item) as [
    HTMLElement,
    HTMLElement,
    HTMLElement
  ];

  await triggerEvent(first, 'pointerup', { bubbles: true });
  assert.dom(first).hasAria('selected', 'true', 'Clicking first option selects it');

  await triggerEvent(second, 'pointerup');
  assert.dom(second).hasAria('selected', 'true', 'Clicking second option selects it');
  assert.dom(first).doesNotHaveAria('selected', '... and deselects first option');

  await triggerEvent(third, 'pointerup');
  assert.dom(third).hasAria('selected', 'true', 'Clicking last option selects it');
  assert.dom(second).doesNotHaveAria('selected', '... and deselects second option');
}

//
// BEHAVIOR
//

export async function selectTab(target: Target, options: Record<string, unknown> = {}) {
  await triggerEvent(target, 'pointerup', options);
}

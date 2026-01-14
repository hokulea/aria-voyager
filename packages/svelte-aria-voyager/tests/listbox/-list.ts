import { expect, test } from 'vitest';
import { type Locator, userEvent } from 'vitest/browser';

type Elements =
  | HTMLElement
  | Locator
  | {
      target?: HTMLElement;
      list: HTMLElement;
    };

function isLocator(elements: Elements): elements is Locator {
  return 'element' in elements && typeof elements.element === 'function';
}

function getElements(elements: Elements) {
  let list, target;

  if (elements instanceof HTMLElement) {
    list = target = elements;
  } else if (isLocator(elements)) {
    list = target = elements.element() as HTMLElement;
  } else {
    list = elements.list;
    target = elements.target ?? elements.list;
  }

  return { list, target };
}

type Selectors = {
  option: string;
};

function getOptions(parent: HTMLElement, selector: string): HTMLElement[] {
  return [...parent.querySelectorAll(selector)] as HTMLElement[];
}

export function getListboxOptions(parent: HTMLElement, selectors?: Selectors) {
  return getOptions(parent, selectors?.option ?? '[role="option"]');
}

export function testListboxKeyboardNavigation(elements: Elements, selectors?: Selectors): void {
  const { list, target } = getElements(elements);
  const options = getListboxOptions(list, selectors);
  const [first, second, last] = options;

  test('First option is activated', async () => {
    target.focus();
    expect(document.activeElement).toBe(target);

    await expect.element(first).toHaveAttribute('aria-current', 'true');
  });

  test('ArrowDown activates second option and deactivates first option', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(second).toHaveAttribute('aria-current', 'true');
    await expect.element(first).not.toHaveAttribute('aria-current');
  });

  test('ArrowDown activates last option', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(last).toHaveAttribute('aria-current', 'true');
    await expect.element(second).not.toHaveAttribute('aria-current');
  });

  test('Home activates first option', async () => {
    await userEvent.keyboard('{Home}');

    await expect.element(first).toHaveAttribute('aria-current', 'true');
    await expect.element(last).not.toHaveAttribute('aria-current');
  });

  test('End activates last option', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(last).toHaveAttribute('aria-current', 'true');
    await expect.element(first).not.toHaveAttribute('aria-current');
  });
}

//
// SELECTION
//

export function testListboxForKeyboardSingleSelection(
  elements: Elements,
  selectors?: Selectors
): void {
  const { list, target } = getElements(elements);
  const options = getListboxOptions(list, selectors);
  const [first, second, last] = options;

  test('First option is activated and selected', async () => {
    target.focus();
    expect(document.activeElement).toBe(target);

    await expect.element(first).toHaveAttribute('aria-current', 'true');
    await expect.element(first).toHaveAttribute('aria-selected', 'true');
  });

  test('ArrowDown selects second option and deselects first option', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(second).toHaveAttribute('aria-selected', 'true');
    await expect.element(first).not.toHaveAttribute('aria-selected');
  });

  test('ArrowDown selects last option', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(last).toHaveAttribute('aria-selected', 'true');
    await expect.element(second).not.toHaveAttribute('aria-selected');
  });

  test('Home selects first option', async () => {
    await userEvent.keyboard('{Home}');

    await expect.element(first).toHaveAttribute('aria-selected', 'true');
    await expect.element(last).not.toHaveAttribute('aria-selected');
  });

  test('End selects last option', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(last).toHaveAttribute('aria-selected', 'true');
    await expect.element(first).not.toHaveAttribute('aria-selected');
  });
}

export function testListboxForKeyboardMultiSelection(
  elements: Elements,
  selectors?: Selectors
): void {
  const { list, target } = getElements(elements);
  const options = getListboxOptions(list, selectors);
  const [first, second, last] = options;

  test('First option is activated and not selected', async () => {
    target.focus();
    expect(document.activeElement).toBe(target);

    await expect.element(first).toHaveAttribute('aria-current', 'true');
    await expect.element(first).not.toHaveAttribute('aria-selected', 'true');
  });

  test('SPACE selects first option', async () => {
    await userEvent.keyboard(' ');
    await expect.element(first).toHaveAttribute('aria-selected', 'true');
  });

  test('SPACE deselects first option', async () => {
    await userEvent.keyboard(' ');
    await expect.element(first).not.toHaveAttribute('aria-selected', 'true');
  });

  test('SPACE selects first option', async () => {
    await userEvent.keyboard(' ');
    await expect.element(first).toHaveAttribute('aria-selected', 'true');
  });

  test('ArrowDown + SPACE selects second option ... and first option still selected', async () => {
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard(' ');

    await expect.element(second).toHaveAttribute('aria-selected', 'true');
    await expect.element(first).toHaveAttribute('aria-selected', 'true');
  });

  test('End + SPACE selects last option ... and first option still selected ... and second option still selected', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard(' ');

    await expect.element(last).toHaveAttribute('aria-selected', 'true');
    await expect.element(second).toHaveAttribute('aria-selected', 'true');
    await expect.element(first).toHaveAttribute('aria-selected', 'true');
  });

  test('Home + SPACE deselects first option ... and second option still selected ... and last option still selected', async () => {
    await userEvent.keyboard('{Home}');
    await userEvent.keyboard(' ');

    await expect.element(first).not.toHaveAttribute('aria-selected', 'true');
    await expect.element(second).toHaveAttribute('aria-selected', 'true');
    await expect.element(last).toHaveAttribute('aria-selected', 'true');
  });

  test('ArrowDown + SPACE deselects second option', async () => {
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard(' ');

    await expect.element(second).not.toHaveAttribute('aria-selected', 'true');
  });

  test('ArrowDown + SPACE deselects last option', async () => {
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard(' ');

    await expect.element(last).not.toHaveAttribute('aria-selected', 'true');
  });

  test('Meta + A selects all', async () => {
    await userEvent.keyboard('{Meta>}a');

    await expect.element(first).toHaveAttribute('aria-selected', 'true');
    await expect.element(second).toHaveAttribute('aria-selected', 'true');
    await expect.element(last).toHaveAttribute('aria-selected', 'true');
  });
}

export function testListboxKeyboardSelection(elements: Elements, selectors?: Selectors): void {
  const { list } = getElements(elements);
  const multi = list.getAttribute('aria-multiselectable');

  if (multi) {
    testListboxForKeyboardMultiSelection(elements, selectors);
  } else {
    testListboxForKeyboardSingleSelection(elements, selectors);
  }
}

//
// POINTER
//

export function testListboxPointerNavigation(elements: Elements, selectors?: Selectors): void {
  const { list } = getElements(elements);
  const options = getListboxOptions(list, selectors);
  const [first, second, last] = options;

  test('Clicking first option activates it', async () => {
    await userEvent.click(first);

    await expect.element(first).toHaveAttribute('aria-current', 'true');
  });

  test('Clicking second option activates it ... and deactivates first option', async () => {
    await userEvent.click(second);

    await expect.element(first).not.toHaveAttribute('aria-current', 'true');
    await expect.element(second).toHaveAttribute('aria-current', 'true');
  });

  test('Clicking last option activates it ... and deactivates second option', async () => {
    await userEvent.click(last);

    await expect.element(second).not.toHaveAttribute('aria-current', 'true');
    await expect.element(last).toHaveAttribute('aria-current', 'true');
  });
}

export function testListboxForPointerSingleSelection(
  elements: Elements,
  selectors?: Selectors
): void {
  const { list } = getElements(elements);
  const options = getListboxOptions(list, selectors);
  const [first, second, last] = options;

  test('Clicking first option selects it', async () => {
    await userEvent.click(first);

    await expect.element(first).toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking second option selects it ... and deselects first option', async () => {
    await userEvent.click(second);

    await expect.element(first).not.toHaveAttribute('aria-selected', 'true');
    await expect.element(second).toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking last option selects it ... and deselects second option', async () => {
    await userEvent.click(last);

    await expect.element(second).not.toHaveAttribute('aria-selected', 'true');
    await expect.element(last).toHaveAttribute('aria-selected', 'true');
  });
}

export function testListboxForPointerMultiSelection(
  elements: Elements,
  selectors?: Selectors
): void {
  const { list } = getElements(elements);
  const options = getListboxOptions(list, selectors);
  const [first, second, last] = options;

  test('Clicking first option selects it', async () => {
    await userEvent.click(first);

    await expect.element(first).toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking first option (with meta) deselects it', async () => {
    await userEvent.keyboard('{Meta>}');
    await userEvent.click(first);
    await userEvent.keyboard('{/Meta}');

    await expect.element(first).not.toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking first option selects it', async () => {
    await userEvent.click(first);

    await expect.element(first).toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking second option (with meta) selects it... and first option still selected', async () => {
    await userEvent.keyboard('{Meta>}');
    await userEvent.click(second);
    await userEvent.keyboard('{/Meta}');

    await expect.element(first).toHaveAttribute('aria-selected', 'true');
    await expect.element(second).toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking last option (with meta) selects it... and first and second option still selected', async () => {
    await userEvent.keyboard('{Meta>}');
    await userEvent.click(last);
    await userEvent.keyboard('{/Meta}');

    await expect.element(first).toHaveAttribute('aria-selected', 'true');
    await expect.element(second).toHaveAttribute('aria-selected', 'true');
    await expect.element(last).toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking first option (with meta) deselects it... and first and second option still selected', async () => {
    await userEvent.keyboard('{Meta>}');
    await userEvent.click(first);
    await userEvent.keyboard('{/Meta}');

    await expect.element(first).not.toHaveAttribute('aria-selected', 'true');
    await expect.element(second).toHaveAttribute('aria-selected', 'true');
    await expect.element(last).toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking second option (with meta) deselects it', async () => {
    await userEvent.keyboard('{Meta>}');
    await userEvent.click(second);
    await userEvent.keyboard('{/Meta}');

    await expect.element(second).not.toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking last option (with meta) deselects it', async () => {
    await userEvent.keyboard('{Meta>}');
    await userEvent.click(last);
    await userEvent.keyboard('{/Meta}');

    await expect.element(last).not.toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking first option selects it', async () => {
    await userEvent.click(first);

    await expect.element(first).toHaveAttribute('aria-selected', 'true');
  });

  test('Clicking last option (with shift) selects it... and second option too', async () => {
    await userEvent.keyboard('{Shift>}');
    await userEvent.click(last);
    await userEvent.keyboard('{/Shift}');

    await expect.element(first).toHaveAttribute('aria-selected', 'true');
    await expect.element(second).toHaveAttribute('aria-selected', 'true');
    await expect.element(last).toHaveAttribute('aria-selected', 'true');
  });
}

export function testListboxPointerSelection(elements: Elements, selectors?: Selectors): void {
  const { list } = getElements(elements);
  const multi = list.getAttribute('aria-multiselectable');

  if (multi) {
    testListboxForPointerMultiSelection(elements, selectors);
  } else {
    testListboxForPointerSingleSelection(elements, selectors);
  }
}

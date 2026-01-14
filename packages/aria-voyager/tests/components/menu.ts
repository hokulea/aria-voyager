import { Menu as MenuBehavior } from '#src';
import { uniqueId } from '#src/utils';

import { getCompositeItems } from './-composites';

export function createMenuElement(parent: HTMLElement) {
  const element = document.createElement('div');

  element.role = 'menu';
  element.classList.add('menu');

  parent.append(element);

  return element;
}

export function appendItemToMenu(parent: HTMLElement, item: string) {
  const elem = document.createElement('button');

  elem.type = 'button';
  elem.role = 'menuitem';

  const label = document.createElement('span');

  label.append(item);

  elem.append(label);

  parent.append(elem);

  return elem;
}

export function appendCheckboxItemToMenu(parent: HTMLElement, item: string, checked = false) {
  const elem = appendItemToMenu(parent, item);

  elem.role = 'menuitemcheckbox';
  elem.setAttribute('aria-checked', checked ? 'true' : 'false');

  return elem;
}

export function appendRadioItemToMenu(parent: HTMLElement, item: string, checked = false) {
  const elem = appendItemToMenu(parent, item);

  elem.role = 'menuitemcheckbox';
  elem.setAttribute('aria-checked', checked ? 'true' : 'false');

  return elem;
}

export function appendSubmenuToMenu(parent: HTMLElement, item: string, menu: HTMLElement) {
  menu.id = uniqueId();
  menu.setAttribute('popover', '');
  // @ts-expect-error doesn't know that CSS yet
  menu.style.positionAnchor = `--${menu.id}`;

  const elem = appendItemToMenu(parent, item);

  // @ts-expect-error doesn't know that CSS yet
  elem.style.anchorName = `--${menu.id}`;
  elem.ariaHasPopup = 'menu';
  elem.setAttribute('popovertarget', menu.id);

  parent.append(menu);
}

export function withTriggerButton(parent: HTMLElement, menu: HTMLElement) {
  menu.id = uniqueId();
  menu.setAttribute('popover', '');
  // @ts-expect-error doesn't know that CSS yet
  menu.style.positionAnchor = `--${menu.id}`;

  const trigger = document.createElement('button');

  // @ts-expect-error doesn't know that CSS yet
  trigger.style.anchorName = `--${menu.id}`;
  trigger.ariaHasPopup = 'menu';
  trigger.setAttribute('popovertarget', menu.id);

  parent.append(trigger);

  return trigger;
}

export class Menu {
  private element!: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.createElement(parent);
  }

  createElement(parent: HTMLElement) {
    this.element = createMenuElement(parent);

    new MenuBehavior(this.element);
  }

  setItems(items: string[]) {
    for (const item of items) {
      appendItemToMenu(this.element, item);
    }
  }
}

export function getItems(parent: HTMLElement) {
  return getCompositeItems(
    parent,
    '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]',
    'menu, [role="menu"]'
  );
}

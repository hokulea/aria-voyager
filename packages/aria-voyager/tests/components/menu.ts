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

  elem.append(item);
  elem.type = 'button';
  elem.role = 'menuitem';

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

  const elem = appendItemToMenu(parent, item);

  elem.setAttribute('popovertarget', menu.id);

  parent.append(menu);
}

export function withTriggerButton(parent: HTMLElement, menu: HTMLElement) {
  menu.id = uniqueId();
  menu.setAttribute('popover', '');

  const trigger = document.createElement('button');

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

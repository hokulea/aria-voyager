import type { MenuItem } from '../controls/menu';

export function isMenuItemElement(element: HTMLElement) {
  return ['menuitem', 'menuitemcheckbox', 'menuitemradio'].includes(element.role as string);
}

export function isMenuElement(element: HTMLElement) {
  return element.role === 'menu' || element.tagName.toLowerCase() === 'menu';
}

export function getParentMenu(menu: HTMLElement): HTMLElement | undefined {
  let elem: HTMLElement | null = menu.parentElement;

  while (elem) {
    if (isMenuElement(elem)) {
      return elem;
    }

    elem = elem.parentElement;
  }

  return undefined;
}

export function getRootMenu(menu: HTMLElement): HTMLElement | undefined {
  const menus = [];

  let elem: HTMLElement | null = menu;

  while (elem) {
    if (isMenuElement(elem) && elem.hasAttribute('popover')) {
      menus.push(elem);
    }

    elem = elem.parentElement;
  }

  return menus.pop();
}

export function getMenuItemFromEvent(event: PointerEvent): HTMLElement | undefined {
  const path = event.composedPath() as HTMLElement[];
  let elem = path.pop();

  while (elem) {
    if (isMenuItemElement(elem)) {
      return elem;
    }

    elem = path.pop();
  }

  return undefined;
}

export function getMenuFromItem(item: MenuItem): HTMLElement | undefined {
  return item.popoverTargetElement ? (item.popoverTargetElement as HTMLElement) : undefined;
}

import { v4 as uuid } from 'uuid';

import { appendItemToMenu, appendSubmenuToMenu, createMenuElement } from '../components/menu';

import type { Menu } from '../../src';

export function createSectionedMenu() {
  const appearanceMenu = createMenuElement(document.body);

  appendItemToMenu(appearanceMenu, 'Full Screen');
  appendItemToMenu(appearanceMenu, 'Zen Mode');
  appendItemToMenu(appearanceMenu, 'Centered Layout');

  appearanceMenu.append(document.createElement('hr'));

  const panels = document.createElement('div');
  const panelsHeader = document.createElement('header');

  panelsHeader.append('Panels');
  panels.append(panelsHeader);

  appendItemToMenu(panels, 'Primary Side Bar');
  appendItemToMenu(panels, 'Secondary Side Bar');
  appendItemToMenu(panels, 'Status Bar');
  appendItemToMenu(panels, 'Panel');

  appearanceMenu.append(document.createElement('hr'));

  return { appearanceMenu, panelsHeader };
}

export function createRefactorMenu() {
  const refactorMenu = createMenuElement(document.body);

  appendItemToMenu(refactorMenu, 'Format Document');
  appendItemToMenu(refactorMenu, 'Refactor...');
  appendItemToMenu(refactorMenu, 'Source Action...');
  refactorMenu.append(document.createElement('hr'));

  const shareMenu = createMenuElement(refactorMenu);

  appendItemToMenu(shareMenu, 'Code');

  const socialMenu = createMenuElement(shareMenu);

  appendItemToMenu(socialMenu, 'Twitter');
  appendItemToMenu(socialMenu, 'Mastodon');
  appendItemToMenu(socialMenu, 'Bsky');
  appendSubmenuToMenu(shareMenu, 'Social', socialMenu);

  appendSubmenuToMenu(refactorMenu, 'Share', shareMenu);

  refactorMenu.append(document.createElement('hr'));
  appendItemToMenu(refactorMenu, 'Cut');
  appendItemToMenu(refactorMenu, 'Copy');
  appendItemToMenu(refactorMenu, 'Paste');

  return { refactorMenu, socialMenu, shareMenu };
}

export function withTriggerButton(menu: HTMLElement) {
  const id = uuid();
  const button = document.createElement('button');

  button.setAttribute('popovertarget', id);
  button.setAttribute('type', 'button');
  button.append('Trigger Menu');
  document.body.append(button);

  menu.id = id;
  menu.setAttribute('popover', '');

  return button;
}

export function createRefactorMenuWithTriggerButton() {
  const menus = createRefactorMenu();
  const triggerButton = withTriggerButton(menus.refactorMenu);

  return {
    ...menus,
    triggerButton
  };
}

export function createSectionedMenuWithTriggerButton() {
  const menus = createSectionedMenu();
  const triggerButton = withTriggerButton(menus.appearanceMenu);

  return {
    ...menus,
    triggerButton
  };
}

export function getItems(menu: Menu) {
  return {
    firstItem: menu.items[0],
    secondItem: menu.items[1],
    thirdItem: menu.items[2],
    fourthItem: menu.items[3],
    fifthItem: menu.items[4],
    sixthItem: menu.items[5],
    lastItem: menu.items[6]
  };
}

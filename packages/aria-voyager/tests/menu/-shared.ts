import { v4 as uuid } from 'uuid';

import {
  appendCheckboxItemToMenu,
  appendItemToMenu,
  appendRadioItemToMenu,
  appendSubmenuToMenu,
  createMenuElement
} from '../components/menu';

import type { Menu } from '../../src';

export function createCodeMenu() {
  const codeMenu = createMenuElement(document.body);

  // Refactor
  const refactorHeader = document.createElement('span');

  refactorHeader.append('Refactor');

  codeMenu.append(refactorHeader);

  appendItemToMenu(codeMenu, 'Format Document');
  appendItemToMenu(codeMenu, 'Refactor...');
  appendItemToMenu(codeMenu, 'Source Action...');
  codeMenu.append(document.createElement('hr'));

  const shareMenu = createMenuElement(codeMenu);

  appendItemToMenu(shareMenu, 'Code');

  const socialMenu = createMenuElement(shareMenu);

  appendItemToMenu(socialMenu, 'Twitter');
  appendItemToMenu(socialMenu, 'Mastodon');
  appendItemToMenu(socialMenu, 'Bsky');
  appendSubmenuToMenu(shareMenu, 'Social', socialMenu);

  appendSubmenuToMenu(codeMenu, 'Share', shareMenu);

  codeMenu.append(document.createElement('hr'));
  appendItemToMenu(codeMenu, 'Cut');
  appendItemToMenu(codeMenu, 'Copy');
  appendItemToMenu(codeMenu, 'Paste');

  // Appearance
  const appearanceHeader = document.createElement('span');

  appearanceHeader.append('Appearance');

  codeMenu.append(appearanceHeader);

  codeMenu.append(document.createElement('hr'));

  appendItemToMenu(codeMenu, 'Full Screen');
  appendItemToMenu(codeMenu, 'Zen Mode');
  appendItemToMenu(codeMenu, 'Centered Layout');

  codeMenu.append(document.createElement('hr'));

  const panels = document.createElement('div');

  panels.role = 'presentation';

  appendCheckboxItemToMenu(panels, 'Primary Side Bar', true);
  appendCheckboxItemToMenu(panels, 'Secondary Side Bar', true);
  appendCheckboxItemToMenu(panels, 'Status Bar', true);
  appendCheckboxItemToMenu(panels, 'Panel', true);

  codeMenu.append(document.createElement('hr'));

  const panelPositionMenu = createMenuElement(codeMenu);

  appendRadioItemToMenu(panelPositionMenu, 'Top');
  appendRadioItemToMenu(panelPositionMenu, 'Left');
  appendRadioItemToMenu(panelPositionMenu, 'Right');
  appendRadioItemToMenu(panelPositionMenu, 'Bottom', true);

  appendSubmenuToMenu(codeMenu, 'Panel Position', panelPositionMenu);

  return { codeMenu, socialMenu, shareMenu, panelPositionMenu, refactorHeader, appearanceHeader };
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

export function createCodeMenuWithTriggerButton() {
  const menus = createCodeMenu();
  const triggerButton = withTriggerButton(menus.codeMenu);

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
    // ...
    fourthLastItem: menu.items.at(-4) as HTMLElement,
    thirdLastItem: menu.items.at(-3) as HTMLElement,
    secondLastItem: menu.items.at(-2) as HTMLElement,
    lastItem: menu.items.at(-1) as HTMLElement
  };
}

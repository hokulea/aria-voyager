import { afterAll, beforeAll } from 'vitest';

import { type EmitStrategy, Menu, type UpdateStrategy } from '#src';
import { uniqueId } from '#src/utils';
import {
  appendCheckboxItemToMenu,
  appendItemToMenu,
  appendRadioItemToMenu,
  appendSubmenuToMenu,
  createMenuElement
} from '#tests/components/menu';

import { getControlItems } from '#tests/test-support/-items';
import { setupTest } from '#tests/test-support/setup-test';

export function createCodeMenu(parent = document.body) {
  const codeMenu = createMenuElement(parent);

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

  codeMenu.append(document.createElement('hr'));

  appearanceHeader.append('Appearance');

  codeMenu.append(appearanceHeader);

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

  codeMenu.append(panels);

  codeMenu.append(document.createElement('hr'));

  const panelPositionMenu = createMenuElement(codeMenu);

  appendRadioItemToMenu(panelPositionMenu, 'Top');
  appendRadioItemToMenu(panelPositionMenu, 'Left');
  appendRadioItemToMenu(panelPositionMenu, 'Right');
  appendRadioItemToMenu(panelPositionMenu, 'Bottom', true);

  appendSubmenuToMenu(codeMenu, 'Panel Position', panelPositionMenu);

  return { codeMenu, socialMenu, shareMenu, panelPositionMenu, refactorHeader, appearanceHeader };
}

export function withTriggerButton(menu: HTMLElement, parent = document.body) {
  const id = uniqueId();
  const button = document.createElement('button');

  button.setAttribute('popovertarget', id);
  button.setAttribute('type', 'button');
  button.classList.add('button');
  button.append('Trigger Menu');
  parent.append(button);

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

export type CodeMenuContext = {
  menu: Menu;
  share: Menu;
  social: Menu;
  panelPosition: Menu;
  codeMenu: HTMLElement;
  shareMenu: HTMLElement;
  socialMenu: HTMLElement;
  panelPositionMenu: HTMLElement;
  triggerButton: HTMLElement;
  refactorHeader: HTMLElement;
  appearanceHeader: HTMLElement;
  // Main menu items
  firstItem: HTMLElement;
  secondItem: HTMLElement;
  thirdItem: HTMLElement;
  fourthItem: HTMLElement;
  fifthItem: HTMLElement;
  sixthItem: HTMLElement;
  fourthLastItem: HTMLElement;
  thirdLastItem: HTMLElement;
  secondLastItem: HTMLElement;
  lastItem: HTMLElement;
  // Share submenu items
  shareFirstItem: HTMLElement;
  shareSecondItem: HTMLElement;
  shareThirdItem: HTMLElement;
  shareFourthItem: HTMLElement;
  shareFifthItem: HTMLElement;
  shareSixthItem: HTMLElement;
  shareFourthLastItem: HTMLElement;
  shareThirdLastItem: HTMLElement;
  shareSecondLastItem: HTMLElement;
  shareLastItem: HTMLElement;
};

export interface SetupCodeMenuOptions {
  withTrigger?: boolean;
  disabled?: boolean;
  menuOptions?: {
    updater?: UpdateStrategy;
    emitter?: EmitStrategy;
  };
}

export function setupCodeMenu(options?: SetupCodeMenuOptions): CodeMenuContext {
  setupTest();

  const ctx: Partial<CodeMenuContext> = {};
  const result = {} as CodeMenuContext;

  // Define getters for all properties so destructuring works correctly
  const properties: (keyof CodeMenuContext)[] = [
    'menu',
    'share',
    'social',
    'panelPosition',
    'codeMenu',
    'shareMenu',
    'socialMenu',
    'panelPositionMenu',
    'triggerButton',
    'refactorHeader',
    'appearanceHeader',
    'firstItem',
    'secondItem',
    'thirdItem',
    'fourthItem',
    'fifthItem',
    'sixthItem',
    'fourthLastItem',
    'thirdLastItem',
    'secondLastItem',
    'lastItem',
    'shareFirstItem',
    'shareSecondItem',
    'shareThirdItem',
    'shareFourthItem',
    'shareFifthItem',
    'shareSixthItem',
    'shareFourthLastItem',
    'shareThirdLastItem',
    'shareSecondLastItem',
    'shareLastItem'
  ];

  for (const prop of properties) {
    Object.defineProperty(result, prop, {
      get: () => ctx[prop],
      enumerable: true
    });
  }

  beforeAll(() => {
    // eslint-disable-next-line unicorn/prefer-minimal-ternary
    const setup = options?.withTrigger ? createCodeMenuWithTriggerButton() : createCodeMenu();

    ctx.codeMenu = setup.codeMenu;
    ctx.shareMenu = setup.shareMenu;
    ctx.socialMenu = setup.socialMenu;
    ctx.panelPositionMenu = setup.panelPositionMenu;
    ctx.refactorHeader = setup.refactorHeader;
    ctx.appearanceHeader = setup.appearanceHeader;
    // @ts-expect-error this seems to happen here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ctx.triggerButton = setup.triggerButton;

    if (options?.disabled) {
      ctx.codeMenu.setAttribute('aria-disabled', 'true');
    }

    ctx.menu = new Menu(ctx.codeMenu, options?.menuOptions);
    ctx.share = new Menu(ctx.shareMenu);
    ctx.social = new Menu(ctx.socialMenu);
    ctx.panelPosition = new Menu(ctx.panelPositionMenu);

    // Populate items from main menu
    const items = getControlItems(ctx.menu);

    Object.assign(ctx, items);

    // Populate items from share submenu with prefix
    const shareItems = getControlItems(ctx.share);

    for (const [key, value] of Object.entries(shareItems)) {
      // @ts-expect-error the string string is not the key, correct
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, unicorn/no-unsafe-property-key
      ctx[`share${key.charAt(0).toUpperCase()}${key.slice(1)}`] = value;
    }
  });

  afterAll(() => {
    ctx.menu?.dispose();
    ctx.share?.dispose();
    ctx.social?.dispose();
    ctx.panelPosition?.dispose();
  });

  return result;
}

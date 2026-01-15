import { isKeyboardEvent, isPointerEvent, isToggleEvent, matchesKeys } from '../utils/event';
import { getMenuFromItem, getMenuItemFromEvent, getRootMenu } from '../utils/menu';

import type { Control } from '..';
import type { MenuItem } from '../controls/menu';
import type { FocusStrategy } from './focus-strategy';
import type { EventNames, NavigationParameterBag, NavigationPattern } from './navigation-pattern';

const OPENER = Symbol('Opener');
const FOCUS_ON_OPEN = Symbol('FocusOnOpen');
const FOCUS_TRIGGER_ON_CLOSE = Symbol('FocusTriggerOnClose');

type MenuElement = HTMLElement & {
  [OPENER]?: HTMLElement;
  [FOCUS_ON_OPEN]?: boolean;
  [FOCUS_TRIGGER_ON_CLOSE]?: boolean;
};

function showSubmenu(
  menu: MenuElement,
  { moveFocus = false, source }: { moveFocus?: boolean; source: HTMLElement }
) {
  menu[FOCUS_ON_OPEN] = moveFocus;
  menu.showPopover({
    source
  });
}

function hideSubmenu(menu: MenuElement, { focusTrigger }: { focusTrigger: boolean }) {
  menu[FOCUS_TRIGGER_ON_CLOSE] = focusTrigger;
  menu.hidePopover();
}

export class MenuNavigation implements NavigationPattern {
  eventListeners: EventNames[] = ['keydown', 'toggle', 'pointerover', 'pointerout', 'pointerup'];

  constructor(
    private control: Control,
    private focusStrategy: FocusStrategy
  ) {}

  matches(event: Event): boolean {
    return (
      (event instanceof KeyboardEvent &&
        (event.key === ' ' ||
          event.key === 'Enter' ||
          event.key === 'ArrowRight' ||
          event.key === 'ArrowLeft')) ||
      event.type === 'toggle' ||
      event.type === 'pointerover' ||
      event.type === 'pointerout' ||
      event.type === 'pointerup'
    );
  }

  handle(bag: NavigationParameterBag): NavigationParameterBag {
    const { event } = bag;

    // -> keyboard navigation
    if (isKeyboardEvent(event)) {
      this.navigateWithKeyboard(event);
    }

    // -> pointer navigation
    else if (isPointerEvent(event)) {
      this.navigateWithPointer(event);
    }

    // toggle behavior
    else if (isToggleEvent(event)) {
      if (event.newState === 'open') {
        if (event.source) {
          (this.control.element as MenuElement)[OPENER] = event.source as HTMLElement;
        }

        this.show();
      } else {
        this.hide();
      }
    }

    return bag;
  }

  navigateWithKeyboard(event: KeyboardEvent) {
    if (this.control.activeItem) {
      const itemHasSubmenu = this.control.activeItem.hasAttribute('popovertarget');

      if (itemHasSubmenu && matchesKeys(event, ['ArrowRight', 'Enter', ' '])) {
        const menu = getMenuFromItem(this.control.activeItem as MenuItem);

        if (menu) {
          event.preventDefault();

          showSubmenu(menu, { moveFocus: true, source: this.control.activeItem });
        }
      }

      // close menu, when action is invoked
      if (!itemHasSubmenu && matchesKeys(event, ['Enter', ' '])) {
        event.preventDefault();

        this.control.activeItem.click();
        this.closeRootMenu();
      }
    }

    if (matchesKeys(event, 'ArrowLeft') && this.control.element.hasAttribute('popover')) {
      hideSubmenu(this.control.element, { focusTrigger: true });
    }
  }

  navigateWithPointer(event: PointerEvent) {
    const menuItem = getMenuItemFromEvent(event);

    switch (event.type) {
      // hover ...
      case 'pointerover': {
        if (menuItem) {
          // close sibling menus
          for (const item of this.control.items
            .filter((i) => i !== menuItem)
            .filter((i) => i.hasAttribute('popovertarget'))) {
            this.closeSubmenu(item as MenuItem);
          }

          if (menuItem.hasAttribute('popovertarget')) {
            const menu = getMenuFromItem(menuItem as MenuItem);

            if (menu) {
              showSubmenu(menu, { source: menuItem });
            }
          }
        }

        break;
      }
      case 'pointerout': {
        // moving pointer from menu to trigger
        if (
          event.target === this.control.element &&
          event.relatedTarget === (this.control.element as MenuElement)[OPENER]
        ) {
          (event.relatedTarget as HTMLElement).focus();
        }

        // Clear menu when pointer leaves menu entirely
        else if (event.target === this.control.element && this.isLeavingMenu(event)) {
          // close open menus
          for (const item of this.control.items.filter((i) => i.hasAttribute('popovertarget'))) {
            this.closeSubmenu(item as MenuItem);
          }

          // Ensure first item remains tabbable for keyboard access
          if (
            this.control.element.hasAttribute('popover') &&
            this.control.enabledItems.length > 0
          ) {
            this.focusStrategy.activateItem(this.control.enabledItems[0]);
          }
        }

        break;
      }
      case 'pointerup': {
        // only close the menu if we have clicked a menuitem
        if (
          menuItem &&
          this.control.items.some((item) => item.contains(menuItem)) &&
          !this.control.activeItem?.hasAttribute('popovertarget')
        ) {
          // firefox wouldn't execute the default click handler from a menuitem,
          // when `this.closeRootMenu()` is invoked directly.
          // As such, pushing this on the event loop gives firefox "time to breath"
          // and execute the default click handler as well as closing the menu
          globalThis.setTimeout(() => this.closeRootMenu(), 0);
        }

        break;
      }
    }
  }

  show() {
    for (const item of this.control.items) {
      item.setAttribute('tabindex', '-1');
    }

    if (this.control.enabledItems.length > 0) {
      this.control.enabledItems[0].setAttribute('tabindex', '0');
    }

    // move focus to first element
    if (
      (this.control.element as MenuElement)[FOCUS_ON_OPEN] !== false &&
      this.control.enabledItems.length > 0
    ) {
      this.control.enabledItems[0].focus();
    }
  }

  hide() {
    // reset focus
    this.focusStrategy.activeItem = undefined;

    const focusTriggerOnClose = (this.control.element as MenuElement)[FOCUS_TRIGGER_ON_CLOSE];

    if (focusTriggerOnClose !== false) {
      // @ts-expect-error yep, we add out own secret type
      const trigger = this.control.element[OPENER] as HTMLElement | undefined;

      if (trigger) {
        trigger.focus();
      }
    }
  }

  closeSubmenu(item: MenuItem) {
    const menu = getMenuFromItem(item) as MenuElement | undefined;

    if (menu) {
      hideSubmenu(menu, { focusTrigger: false });
    }
  }

  closeRootMenu() {
    const root = getRootMenu(this.control.element);

    if (root) {
      root.hidePopover();
    }
  }

  /**
   * Check if the pointer is leaving the menu entirely (not moving to trigger or submenu).
   */
  private isLeavingMenu(event: PointerEvent): boolean {
    const relatedTarget = event.relatedTarget as HTMLElement | null;

    // Still within the menu element
    if (relatedTarget && this.control.element.contains(relatedTarget)) {
      return false;
    }

    // Moving to the trigger button
    if (relatedTarget === (this.control.element as MenuElement)[OPENER]) {
      return false;
    }

    // Check if moving to a submenu
    for (const item of this.control.items) {
      if (item.hasAttribute('popovertarget')) {
        const submenu = getMenuFromItem(item as MenuItem);

        if (submenu && (submenu === relatedTarget || submenu.contains(relatedTarget))) {
          return false;
        }
      }
    }

    return true;
  }
}

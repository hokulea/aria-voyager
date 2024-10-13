import { EndNavigation } from '../navigation-patterns/end-navigation';
import { HomeNavigation } from '../navigation-patterns/home-navigation';
import { MenuNavigation } from '../navigation-patterns/menu-navigation';
import { NextNavigation } from '../navigation-patterns/next-navigation';
import { PointerNavigation } from '../navigation-patterns/pointer-navigation';
import { PreviousNavigation } from '../navigation-patterns/previous-navigation';
import { RovingTabindexStrategy } from '../navigation-patterns/roving-tabindex-strategy';
import { ScrollToItem } from '../navigation-patterns/scroll-to-item';
import { Control } from './control';

import type { EmitStrategy, UpdateStrategy } from '..';

interface MenuOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
}

export class Menu extends Control {
  protected focusStrategy: RovingTabindexStrategy = new RovingTabindexStrategy(this);

  get selection() {
    return [];
  }

  get activeItem() {
    return this.focusStrategy.activeItem;
  }

  get prevActiveItem() {
    return this.focusStrategy.prevActiveItem;
  }

  constructor(element: HTMLElement, options?: MenuOptions) {
    super(element, {
      capabilities: {
        singleSelection: false,
        multiSelection: false
      },
      ...options
    });

    this.registerNavigationPatterns([
      new NextNavigation(this, ['ArrowDown']),
      new PreviousNavigation(this, ['ArrowUp']),
      new HomeNavigation(this),
      new EndNavigation(this),
      new PointerNavigation(this, 'pointerover'),
      this.focusStrategy,
      new MenuNavigation(this, this.focusStrategy),
      new ScrollToItem(this)
    ]);

    // setup
    element.role = 'menu';

    this.readOptions();
    this.readItems();
  }

  readItems() {
    // Find all descendant elements with role "menuitem", "menuitemcheckbox", or "menuitemradio"
    const items = this.element.querySelectorAll<HTMLElement>(
      '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'
    );

    // Filter out elements that are within a nested menu but not the root menu
    this.items = Array.from(items).filter((item) => {
      // Check if the closest ancestor with <menu> tag or [role="menu"] is not the root element
      const closestMenu = item.closest('menu,[role="menu"]');
      return !closestMenu || closestMenu === this.element;
    });

    this.focusStrategy.updateItems();
  }

  readOptions(): void {
    super.readOptions();

    this.focusStrategy.updateItems();
  }
}

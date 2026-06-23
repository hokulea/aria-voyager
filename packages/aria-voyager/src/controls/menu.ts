import { CheckBehavior } from '../navigation-patterns/check-behavior';
import { EndNavigation } from '../navigation-patterns/end-navigation';
import { HomeNavigation } from '../navigation-patterns/home-navigation';
import { MenuNavigation } from '../navigation-patterns/menu-navigation';
import { NextNavigation } from '../navigation-patterns/next-navigation';
import { PointerNavigation } from '../navigation-patterns/pointer-navigation';
import { PreviousNavigation } from '../navigation-patterns/previous-navigation';
import { RadioSelectionStrategy } from '../navigation-patterns/radio-selection-strategy';
import { RovingTabindexStrategy } from '../navigation-patterns/roving-tabindex-strategy';
import { ScrollToItem } from '../navigation-patterns/scroll-to-item';
import { Control, type ControlWithSelection, type Item } from './control';

import type { EmitStrategy, UpdateStrategy } from '..';

export interface MenuItem extends Item, PopoverTargetAttributes {}

interface MenuOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
}

export class Menu extends Control implements ControlWithSelection {
  protected focusStrategy: RovingTabindexStrategy;
  #selectionStrategy: RadioSelectionStrategy;
  #checkBehavior: CheckBehavior;

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
        singleSelection: true,
        multiSelection: false
      },
      ...options
    });

    this.#checkBehavior = new CheckBehavior(this, {
      isCheckableItem: (item) => item.getAttribute('role') === 'menuitemcheckbox'
    });
    this.#selectionStrategy = new RadioSelectionStrategy(this, {
      isRadioItem: (item) => item.getAttribute('role') === 'menuitemradio',
      behavior: { singleSelection: 'manual', activateSelectionOnFocus: false }
    });
    this.focusStrategy = new RovingTabindexStrategy(this, this.#selectionStrategy);

    this.registerNavigationPatterns([
      new NextNavigation(this, ['ArrowDown']),
      new PreviousNavigation(this, ['ArrowUp']),
      new HomeNavigation(this),
      new EndNavigation(this),
      new PointerNavigation(this, ['pointerover', 'pointerup']),
      this.focusStrategy,
      this.#checkBehavior,
      this.#selectionStrategy,
      new MenuNavigation(this, this.focusStrategy),
      new ScrollToItem(this)
    ]);

    // setup
    element.role = 'menu';

    this.readOptions();
    this.readItems();
  }

  readOptions(): void {
    super.readOptions();

    this.focusStrategy.updateItems();
  }

  readItems() {
    // Find all descendant elements with role "menuitem", "menuitemcheckbox", or "menuitemradio"
    const items = this.element.querySelectorAll<HTMLElement>(
      ':scope [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'
    );

    // Filter out elements that are within a nested menu but not the root menu
    // eslint-disable-next-line unicorn/prefer-spread
    this.items = Array.from(items).filter((item) => {
      // Check if the closest ancestor with <menu> tag or [role="menu"] is not the root element
      const closestMenu = item.closest('menu,[role="menu"]');

      return !closestMenu || closestMenu === this.element;
    });

    this.#checkBehavior.updateItems();
    this.#selectionStrategy.readSelection();
    this.focusStrategy.updateItems();
  }

  readSelection(): void {
    this.#selectionStrategy.readSelection();
  }

  isSelectionAttribute(attributeName: string): boolean {
    return this.#selectionStrategy.isSelectionAttriute(attributeName);
  }
}

import { RovingTabindexStrategy } from '#src/behaviors/focus/roving-tabindex-strategy';
import { EndNavigation } from '#src/behaviors/navigation/end-navigation';
import { HomeNavigation } from '#src/behaviors/navigation/home-navigation';
import { MenuNavigation } from '#src/behaviors/navigation/menu-navigation';
import { NextNavigation } from '#src/behaviors/navigation/next-navigation';
import { PointerNavigation } from '#src/behaviors/navigation/pointer-navigation';
import { PreviousNavigation } from '#src/behaviors/navigation/previous-navigation';
import { ScrollToItem } from '#src/behaviors/navigation/scroll-to-item';
import { CheckBehavior } from '#src/behaviors/selection/check-behavior';
import { RadioSelectionStrategy } from '#src/behaviors/selection/radio-selection-strategy';
import {
  Control,
  type ControlWithChecks,
  type ControlWithSelection,
  type Item
} from '#src/controls/control';

import type { EmitStrategy } from '#src/emit-strategies/emit-strategy';
import type { UpdateStrategy } from '#src/update-strategies/update-strategy';

export interface MenuItem extends Item, PopoverTargetAttributes {}

interface MenuOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
}

export class Menu extends Control implements ControlWithSelection, ControlWithChecks {
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
        multiSelection: false,
        checks: true
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

    this.registerBehavior([
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
    this.focusStrategy.activeItem = undefined;
  }

  readSelection(): void {
    this.#selectionStrategy.readSelection();
  }

  isSelectionAttribute(attributeName: string): boolean {
    return this.#selectionStrategy.isSelectionAttriute(attributeName);
  }

  readChecks() {
    this.#checkBehavior.readChecked();
  }

  isCheckAttribute(attributeName: string): boolean {
    return attributeName === 'aria-checked';
  }
}

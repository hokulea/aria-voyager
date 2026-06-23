import { RovingTabindexStrategy } from '#src/behaviors/focus/roving-tabindex-strategy';
import { EndNavigation } from '#src/behaviors/navigation/end-navigation';
import { HomeNavigation } from '#src/behaviors/navigation/home-navigation';
import { NextNavigation } from '#src/behaviors/navigation/next-navigation';
import { PointerNavigation } from '#src/behaviors/navigation/pointer-navigation';
import { PreviousNavigation } from '#src/behaviors/navigation/previous-navigation';
import { ItemSelectionStrategy } from '#src/behaviors/selection/item-selection-strategy';
import { Control, type ControlWithSelection } from '#src/controls/control';

import type { SelectionBehavior } from '#src/behaviors/selection/selection-strategy';
import type { EmitStrategy } from '#src/emit-strategies/emit-strategy';
import type { UpdateStrategy } from '#src/update-strategies/update-strategy';

export type TablistBehavior = SelectionBehavior;

export interface TablistOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
  behavior?: TablistBehavior;
}

export class Tablist extends Control implements ControlWithSelection {
  protected focusStrategy: RovingTabindexStrategy;
  #selectionStrategy: ItemSelectionStrategy;
  #nextNavigation = new NextNavigation(this, 'ArrowRight');
  #prevNavigation = new PreviousNavigation(this, 'ArrowLeft');

  get selection() {
    return this.#selectionStrategy.selection;
  }

  get activeItem() {
    return this.focusStrategy.activeItem;
  }

  get prevActiveItem() {
    return this.focusStrategy.prevActiveItem;
  }

  constructor(element: HTMLElement, options?: TablistOptions) {
    super(element, {
      capabilities: {
        singleSelection: true,
        multiSelection: false
      },
      optionAttributes: ['aria-orientation'],
      ...options
    });

    this.#selectionStrategy = new ItemSelectionStrategy(this, {
      behavior: options?.behavior ?? {}
    });
    this.focusStrategy = new RovingTabindexStrategy(this, this.#selectionStrategy);

    this.registerBehavior([
      this.#nextNavigation,
      this.#prevNavigation,
      new HomeNavigation(this),
      new EndNavigation(this),
      new PointerNavigation(this),
      this.focusStrategy,
      this.#selectionStrategy
    ]);

    // setup
    element.role = 'tablist';

    this.readOptions();
    this.readItems();
  }

  dispose() {
    super.dispose();

    this.#selectionStrategy.dispose();
  }

  readOptions(): void {
    super.readOptions();

    this.#nextNavigation.keyOrKeys =
      this.options.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    this.#prevNavigation.keyOrKeys =
      this.options.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

    this.focusStrategy.updateItems();
  }

  readItems() {
    this.items = [...this.element.querySelectorAll<HTMLElement>(':scope [role="tab"]')];

    this.#selectionStrategy.select(
      this.selection.filter((selection) => this.items.includes(selection))
    );
    this.ensureSelection();

    this.focusStrategy.updateItems();
  }

  readSelection(): void {
    this.#selectionStrategy.readSelection();
  }

  isSelectionAttribute(attributeName: string): boolean {
    return this.#selectionStrategy.isSelectionAttriute(attributeName);
  }

  ensureSelection() {
    // eslint-disable-next-line unicorn/prefer-early-return
    if (this.selection.length === 0 && this.items.length > 0) {
      this.focusStrategy.activateItem(this.items[0]);
      this.#selectionStrategy.select([this.items[0]]);
    }
  }
}

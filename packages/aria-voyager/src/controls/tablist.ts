import { EndNavigation } from '../navigation-patterns/end-navigation';
import { HomeNavigation } from '../navigation-patterns/home-navigation';
import { NextNavigation } from '../navigation-patterns/next-navigation';
import { PointerNavigation } from '../navigation-patterns/pointer-navigation';
import { PreviousNavigation } from '../navigation-patterns/previous-navigation';
import { RovingTabindexStrategy } from '../navigation-patterns/roving-tabindex-strategy';
import { SelectionStrategy } from '../navigation-patterns/selection-strategy';
import { Control } from './control';

import type { EmitStrategy, UpdateStrategy } from '..';
import type { SelectionBehavior } from '../navigation-patterns/selection-strategy';

export type TablistBehavior = SelectionBehavior;

export interface TablistOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
  behavior?: TablistBehavior;
}

export class Tablist extends Control {
  #selectionStrategy: SelectionStrategy;
  protected focusStrategy: RovingTabindexStrategy = new RovingTabindexStrategy(this);
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

    this.#selectionStrategy = new SelectionStrategy(this, options?.behavior ?? {});

    this.registerNavigationPatterns([
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

  readItems() {
    this.items = [...this.element.querySelectorAll<HTMLElement>('[role="tab"]')];

    this.#selectionStrategy.select(
      this.selection.filter((selection) => this.items.includes(selection))
    );

    this.focusStrategy.updateItems();

    this.ensureSelection();
  }

  readSelection(): void {
    this.#selectionStrategy.readSelection();
  }

  readOptions(): void {
    super.readOptions();

    this.#nextNavigation.keyOrKeys =
      this.options.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    this.#prevNavigation.keyOrKeys =
      this.options.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

    this.focusStrategy.updateItems();
  }

  ensureSelection() {
    if (this.selection.length === 0 && this.items.length > 0) {
      this.focusStrategy.activateItem(this.items[0]);
      this.#selectionStrategy.select([this.items[0]]);
    }
  }
}

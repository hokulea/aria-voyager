import { ActiveDescendentStrategy } from '#src/behaviors/focus/active-descendent-strategy';
import { EndNavigation } from '#src/behaviors/navigation/end-navigation';
import { HomeNavigation } from '#src/behaviors/navigation/home-navigation';
import { NextNavigation } from '#src/behaviors/navigation/next-navigation';
import { PointerNavigation } from '#src/behaviors/navigation/pointer-navigation';
import { PreviousNavigation } from '#src/behaviors/navigation/previous-navigation';
import { ScrollToItem } from '#src/behaviors/navigation/scroll-to-item';
import { ItemSelectionStrategy } from '#src/behaviors/selection/item-selection-strategy';
import { Control, type ControlWithSelection } from '#src/controls/control';

import type { EmitStrategy } from '#src/emit-strategies/emit-strategy';
import type { UpdateStrategy } from '#src/update-strategies/update-strategy';

interface ListboxOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
}

export class Listbox extends Control implements ControlWithSelection {
  protected focusStrategy: ActiveDescendentStrategy;
  #selectionStrategy: ItemSelectionStrategy;

  get selection() {
    return this.#selectionStrategy.selection;
  }

  get activeItem() {
    return this.focusStrategy.activeItem;
  }

  get prevActiveItem() {
    return this.focusStrategy.prevActiveItem;
  }

  constructor(element: HTMLElement, options?: ListboxOptions) {
    super(element, {
      capabilities: {
        singleSelection: true,
        multiSelection: true
      },
      optionAttributes: ['aria-multiselectable'],
      ...options
    });

    this.#selectionStrategy = new ItemSelectionStrategy(this);
    this.focusStrategy = new ActiveDescendentStrategy(this, this.#selectionStrategy);

    this.registerBehavior([
      new NextNavigation(this, ['ArrowDown', 'ArrowRight']),
      new PreviousNavigation(this, ['ArrowUp', 'ArrowLeft']),
      new HomeNavigation(this),
      new EndNavigation(this),
      new PointerNavigation(this),
      this.focusStrategy,
      new ScrollToItem(this),
      this.#selectionStrategy
    ]);

    // setup
    element.role = 'listbox';

    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }

    this.readOptions();
    this.readItems();
  }

  dispose() {
    super.dispose();

    this.#selectionStrategy.dispose();
  }

  readOptions(): void {
    super.readOptions();

    this.element.setAttribute('tabindex', this.options.disabled ? '-1' : '0');

    this.focusStrategy.updateItems();
  }

  readItems() {
    this.items = [...this.element.querySelectorAll(':scope [role="option"]')] as HTMLElement[];

    this.#selectionStrategy.select(
      this.selection.filter((selection) => this.items.includes(selection))
    );

    this.focusStrategy.updateItems();
  }

  readSelection(): void {
    this.#selectionStrategy.readSelection();
  }

  isSelectionAttribute(attributeName: string): boolean {
    return this.#selectionStrategy.isSelectionAttriute(attributeName);
  }
}

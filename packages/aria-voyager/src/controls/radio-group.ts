import { RovingTabindexStrategy } from '#src/behaviors/focus/roving-tabindex-strategy';
import { EndNavigation } from '#src/behaviors/navigation/end-navigation';
import { HomeNavigation } from '#src/behaviors/navigation/home-navigation';
import { NextNavigation } from '#src/behaviors/navigation/next-navigation';
import { PointerNavigation } from '#src/behaviors/navigation/pointer-navigation';
import { PreviousNavigation } from '#src/behaviors/navigation/previous-navigation';
import { RadioSelectionStrategy } from '#src/behaviors/selection/radio-selection-strategy';
import { Control, type ControlWithSelection } from '#src/controls/control';

import type { EmitStrategy } from '#src/emit-strategies/emit-strategy';
import type { UpdateStrategy } from '#src/update-strategies/update-strategy';

export interface RadioGroupOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
}

export class RadioGroup extends Control implements ControlWithSelection {
  protected focusStrategy: RovingTabindexStrategy;
  #selectionStrategy: RadioSelectionStrategy;

  get activeItem() {
    return this.focusStrategy.activeItem;
  }

  get prevActiveItem() {
    return this.focusStrategy.prevActiveItem;
  }

  constructor(element: HTMLElement, options: RadioGroupOptions = {}) {
    super(element, {
      capabilities: {
        singleSelection: true,
        multiSelection: false,
        checks: false
      },
      ...options
    });

    this.#selectionStrategy = new RadioSelectionStrategy(this, {
      behavior: { singleSelection: 'automatic' }
    });
    this.focusStrategy = new RovingTabindexStrategy(this, this.#selectionStrategy);

    this.registerBehavior([
      new NextNavigation(this, ['ArrowDown', 'ArrowRight']),
      new PreviousNavigation(this, ['ArrowUp', 'ArrowLeft']),
      new HomeNavigation(this),
      new EndNavigation(this),
      new PointerNavigation(this),
      this.focusStrategy,
      this.#selectionStrategy
    ]);

    // setup
    element.role = 'radiogroup';

    this.readOptions();
    this.readItems();
  }

  dispose() {
    super.dispose();
  }

  readOptions(): void {
    super.readOptions();

    this.focusStrategy.updateItems();
  }

  readItems() {
    this.items = [...this.element.querySelectorAll<HTMLElement>(':scope [role="radio"]')];

    this.focusStrategy.updateItems();
    this.#selectionStrategy.readSelection();
  }

  isSelectionAttribute(attributeName: string): boolean {
    return this.#selectionStrategy.isSelectionAttriute(attributeName);
  }

  readSelection(): void {
    this.#selectionStrategy.readSelection();
  }
}

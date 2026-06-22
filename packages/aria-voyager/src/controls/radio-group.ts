import { EndNavigation } from '../navigation-patterns/end-navigation';
import { HomeNavigation } from '../navigation-patterns/home-navigation';
import { NextNavigation } from '../navigation-patterns/next-navigation';
import { PointerNavigation } from '../navigation-patterns/pointer-navigation';
import { PreviousNavigation } from '../navigation-patterns/previous-navigation';
import { RadioSelectionStrategy } from '../navigation-patterns/radio-selection-strategy';
import { RovingTabindexStrategy } from '../navigation-patterns/roving-tabindex-strategy';
import { Control, type ControlWithSelection } from './control';

import type { EmitStrategy } from '../emit-strategies/emit-strategy';
import type { UpdateStrategy } from '../update-strategies/update-strategy';

export interface RadioGroupOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
}

export class RadioGroup extends Control implements ControlWithSelection {
  focusStrategy: RovingTabindexStrategy = new RovingTabindexStrategy(this);
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
        multiSelection: false
      },
      ...options
    });

    this.#selectionStrategy = new RadioSelectionStrategy(this, {
      behavior: { singleSelection: 'automatic' }
    });

    this.registerNavigationPatterns([
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

    this.element.setAttribute('tabindex', this.options.disabled ? '-1' : '0');

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
